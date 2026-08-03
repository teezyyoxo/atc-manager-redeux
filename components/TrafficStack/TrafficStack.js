import { Component } from 'preact';
import { createPortal } from 'preact/compat';
import {
  FaInfo,
  FaCommentDots,
  FaCog,
  FaPlane,
  FaPaperPlane,
  FaQuestion,
  FaBars,
  FaTimes
} from 'react-icons/fa/index.esm';
import GameStore from '../../stores/GameStore';
import GameMetaControls from '../../components/GameMetaControls/GameMetaControls';
import {
  routeTypes,
  airplanesById,
  VFRStates,
  allowedVFRStates
} from '../../lib/airplane-library/airplane-library';
import { landableRwys, activeRwys, idType } from '../../lib/map';
import config from '../../lib/config';
import SettingsPanel from '../../containers/SettingsPanel/SettingsPanel';
import InfoPanel from '../../containers/InfoPanel/InfoPanel';
import AboutPanel from '../../containers/AboutPanel/AboutPanel';
import AirplaneInfoPanel from '../../containers/AirplaneInfoPanel/AirplaneInfoPanel';
import LogsPanel from '../../containers/LogsPanel/LogsPanel';
import TrafficStackEntry from '../TrafficStackEntry/TrafficStackEntry';
import Airplane from '../../lib/airplane';
import { parse } from '../../lib/command-parser';
import SettingsStore from '../../stores/SettingsStore';
import { sendMessageError } from '../GameMessages/GameMessages';
import communications from '../../lib/communications';
import { route } from 'preact-router';
import TouchDial from '../TouchDial/TouchDial';
import { lpad } from '../../lib/util';
import { isMobileSession } from '../../lib/mobile';

const vfrInstructionContent = {
  [VFRStates.RWY]: {
    label: 'Runway / land',
    description: 'Continue to the runway and complete the landing.'
  },
  [VFRStates.UPWIND]: {
    label: 'Fly upwind',
    description: 'Track runway heading and climb to pattern altitude.'
  },
  [VFRStates.CROSSWIND]: {
    label: 'Turn crosswind',
    description: 'Turn onto the crosswind leg.'
  },
  [VFRStates.DOWNWIND]: {
    label: 'Join downwind',
    description: 'Enter or continue on the downwind leg.'
  },
  [VFRStates.BASE]: {
    label: 'Turn base',
    description: 'Turn from downwind onto the base leg.'
  },
  [VFRStates.FINAL]: {
    label: 'Turn final',
    description: 'Line up with the selected runway.'
  },
  [VFRStates.STRAIGHT_OUT]: {
    label: 'Straight out',
    description: 'Depart on runway heading.'
  },
  [VFRStates.EXIT_45_DEG_OUT]: {
    label: '45° departure',
    description: 'Exit the pattern at a 45-degree angle.'
  },
  [VFRStates.OWN_DISCRETION]: {
    label: 'Own discretion',
    description: 'Resume navigation without a pattern restriction.'
  },
  [VFRStates.STRAIGHT_IN]: {
    label: 'Straight-in',
    description: 'Proceed directly to final for the selected runway.'
  }
};

const vfrRouteContent = {
  [routeTypes.VFR_CLOSED_PATTERN]: {
    kicker: 'Local pattern · full stop',
    title: 'Choose the next pattern leg',
    hint: 'Move the aircraft around the traffic pattern toward landing.'
  },
  [routeTypes.VFR_CLOSED_PATTERN_TG]: {
    kicker: 'Local pattern · touch and go',
    title: 'Choose the next pattern leg',
    hint: 'Sequence each leg, then return the aircraft to the runway.'
  },
  [routeTypes.VFR_OUTBOUND]: {
    kicker: 'VFR departure',
    title: 'Choose the departure path',
    hint: 'Set how the aircraft leaves the airport after takeoff.'
  },
  [routeTypes.VFR_INBOUND]: {
    kicker: 'VFR arrival · full stop',
    title: 'Choose a runway and arrival leg',
    hint: 'Assign the runway first, then guide the aircraft toward landing.'
  },
  [routeTypes.VFR_INBOUND_TG]: {
    kicker: 'VFR arrival · touch and go',
    title: 'Choose a runway and arrival leg',
    hint: 'Assign the runway first, then sequence the aircraft into pattern.'
  },
  [routeTypes.VFR_ENROUTE]: {
    kicker: 'VFR transit',
    title: 'Release the aircraft to navigate',
    hint: 'Transit traffic continues through the area at its own discretion.'
  }
};

class TrafficStack extends Component {
  constructor(props) {
    super();
    this.state = {
      settingsExpanded: false,
      logsExpanded: false,
      aboutExpanded: false,
      infoExpanded: false,
      mobileMenuExpanded: false,
      cmd: props.cmd,
      textCmd: ''
    };

    this.dtcToDataListId = `dct-tgt-${Math.random()
      .toString()
      .replace('.', '')}`;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.cmd !== this.props.cmd) {
      this.setState({ cmd: nextProps.cmd });
    }
  }

  componentDidMount() {
    this.props.emitter.on('cmdtgt', this.handleAirplaneClick);
    SettingsStore.on('change', this.handleSettingsStoreChange);
    if (typeof window !== 'undefined')
      window.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    this.props.emitter.removeListener('cmdtgt', this.handleAirplaneClick);
    SettingsStore.removeListener('change', this.handleSettingsStoreChange);
    if (typeof window !== 'undefined')
      window.removeEventListener('keydown', this.handleKeyPress);
    this.unlockMobileMenuBackground();
  }

  handleKeyPress = e => {
    if (this.state.mobileMenuExpanded) {
      if (e.key === 'Escape') {
        e.preventDefault();
        this.closeMobileMenu();
      } else if (e.key === 'Tab') {
        this.trapMobileMenuFocus(e);
      }
      return;
    }
    if (GameStore.paused) return;
    if (e.key === 'Enter' && this.state.cmd.tgt) {
      if (SettingsStore.useTextCmd) this.onCmdTextParse();
      else this.props.onCmdExecution();
      return false;
    }
  };

  handleSettingsStoreChange = () => {
    this.setState({});
  };

  handleTakeoffTrigger = () => {
    this.setState(
      prevstate => {
        prevstate.cmd.takeoff = true;
        return prevstate;
      },
      () => {
        this.props.onChange(this.state.cmd);
        this.props.onCmdExecution();
      }
    );
  };

  handleExpandSettingsButtonClick = () => {
    const opening = !this.state.settingsExpanded;
    if (opening) {
      this.optionsResumeOnClose = this.claimMobileMenuPause();
      if (!this.state.mobileMenuExpanded) {
        this.optionsResumeOnClose = !GameStore.paused;
        if (this.optionsResumeOnClose) GameStore.pause(true);
      }
    }
    this.setState({
      settingsExpanded: opening,
      aboutExpanded: false,
      mobileMenuExpanded: false
    }, () => {
      if (!opening) {
        if (this.optionsResumeOnClose) GameStore.resume();
        this.optionsResumeOnClose = false;
        this.restoreMobileMenuToggleFocus();
      }
      this.props.onChange(this.state.cmd);
    });
  };

  handleAboutExpanded = () => {
    const opening = !this.state.aboutExpanded;
    if (opening) {
      this.aboutResumeOnClose = this.claimMobileMenuPause();
      if (!this.state.mobileMenuExpanded) {
        this.aboutResumeOnClose = !GameStore.paused;
        if (this.aboutResumeOnClose) GameStore.pause(true);
      }
    }
    this.setState({
      aboutExpanded: opening,
      settingsExpanded: false,
      mobileMenuExpanded: false
    }, () => {
      if (!opening) {
        if (this.aboutResumeOnClose) GameStore.resume();
        this.aboutResumeOnClose = false;
        this.restoreMobileMenuToggleFocus();
      }
    });
  };

  handleLogsExpanded = () => {
    const opening = !this.state.logsExpanded;
    if (opening) {
      this.logsResumeOnClose = this.claimMobileMenuPause();
      if (!this.state.mobileMenuExpanded) {
        this.logsResumeOnClose = !GameStore.paused;
        if (this.logsResumeOnClose) GameStore.pause(true);
      }
    }
    this.setState({
      copied: false,
      logsExpanded: opening,
      mobileMenuExpanded: false
    }, () => {
      if (!opening && this.logsResumeOnClose) GameStore.resume();
      if (!opening) {
        this.logsResumeOnClose = false;
        this.restoreMobileMenuToggleFocus();
      }
    });
  };

  handleLogsCopied = () => {
    this.setState({ logsCopied: true });
  };

  handleCloseAirplaneInfoPanel = e => {
    this.setState({ infoPanelTgt: null });
  };

  handleTrafficStackInfoButtonClick = e => {
    const index = e.currentTarget.parentElement.getAttribute('data-index');
    const airplane = GameStore.traffic[index];
    if (!airplane) return;
    const model = airplanesById[airplane.typeId];

    this.setState({ infoPanelTgt: { airplane, model } });
  };

  handleGoAroundClick = e => {
    this.setState(
      prevstate => {
        prevstate.cmd.goAround = true;
        return prevstate;
      },
      () => {
        this.props.onChange(this.state.cmd);
        this.props.onCmdExecution();
      }
    );
    // TODO: Speech
  };

  handleInfoExpanded = e => {
    const opening = !this.state.infoExpanded;
    if (opening) {
      this.infoResumeOnClose = this.claimMobileMenuPause();
      if (!this.state.mobileMenuExpanded) {
        this.infoResumeOnClose = !GameStore.paused;
        if (this.infoResumeOnClose) GameStore.pause(true);
      }
    }
    this.setState({
      infoExpanded: opening,
      mobileMenuExpanded: false
    }, () => {
      if (!opening && this.infoResumeOnClose) GameStore.resume();
      if (!opening) {
        this.infoResumeOnClose = false;
        this.restoreMobileMenuToggleFocus();
      }
    });
  };

  handleMobileMenuToggle = () => {
    if (this.state.mobileMenuExpanded) {
      this.closeMobileMenu();
      return;
    }

    this.mobileMenuResumeOnClose = !GameStore.paused;
    if (this.mobileMenuResumeOnClose) GameStore.pause(true);
    this.previousMobileMenuFocus = document.activeElement;
    this.lockMobileMenuBackground();
    this.setState({ mobileMenuExpanded: true }, () => {
      const firstControl = this.mobileMenuDialog &&
        this.mobileMenuDialog.querySelector('button:not([disabled])');
      if (firstControl) firstControl.focus();
    });
  };

  closeMobileMenu = (resumeSession = true, restoreFocus = true) => {
    const shouldResume = resumeSession && this.mobileMenuResumeOnClose;
    this.mobileMenuResumeOnClose = false;
    this.unlockMobileMenuBackground();
    this.setState({ mobileMenuExpanded: false }, () => {
      if (shouldResume) GameStore.resume();
      if (
        restoreFocus &&
        this.previousMobileMenuFocus &&
        this.previousMobileMenuFocus.focus
      ) {
        this.previousMobileMenuFocus.focus();
      }
      this.previousMobileMenuFocus = null;
    });
  };

  claimMobileMenuPause = () => {
    if (!this.state.mobileMenuExpanded) return false;
    const resumeOnClose = this.mobileMenuResumeOnClose;
    this.mobileMenuResumeOnClose = false;
    this.restoreMobileFocusAfterTool = true;
    this.unlockMobileMenuBackground();
    this.previousMobileMenuFocus = null;
    return resumeOnClose;
  };

  restoreMobileMenuToggleFocus = () => {
    if (!this.restoreMobileFocusAfterTool) return;
    this.restoreMobileFocusAfterTool = false;
    if (this.mobileMenuToggle) this.mobileMenuToggle.focus();
  };

  lockMobileMenuBackground = () => {
    this.mobileMenuBackground = document.getElementById('atc-game');
    this.addedMobileMenuInert = !!this.mobileMenuBackground &&
      !this.mobileMenuBackground.hasAttribute('inert');
    if (this.addedMobileMenuInert) {
      this.mobileMenuBackground.setAttribute('inert', '');
    }
    document.documentElement.classList.add('mobile-game-menu-open');
  };

  unlockMobileMenuBackground = () => {
    if (this.addedMobileMenuInert && this.mobileMenuBackground) {
      this.mobileMenuBackground.removeAttribute('inert');
    }
    this.mobileMenuBackground = null;
    this.addedMobileMenuInert = false;
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('mobile-game-menu-open');
    }
  };

  trapMobileMenuFocus = event => {
    if (!this.mobileMenuDialog) return;
    const controls = this.mobileMenuDialog.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), ' +
      'select:not([disabled]), textarea:not([disabled]), ' +
      '[tabindex]:not([tabindex="-1"])'
    );
    if (!controls.length) {
      event.preventDefault();
      return;
    }
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  handleMobileMenuBackdrop = event => {
    if (event.target === event.currentTarget) this.closeMobileMenu();
  };

  handleMobilePauseExit = () => {
    this.closeMobileMenu(false, false);
    GameStore.pause();
  };

  handleHeadingTgtChange = e => {
    this.handleHeadingTgtValueChange(+e.target.value);
  };

  handleHeadingTgtValueChange = value => {
    this.setState(
      prevstate => {
        prevstate.cmd.heading = value;
        prevstate.cmd.direction = '';
        prevstate.cmd.directionOld = true;
        return prevstate;
      },
      () => {
        this.props.onChange(this.state.cmd);
      }
    );
  };

  handleAltitudeTgtChange = e => {
    this.handleAltitudeTgtValueChange(
      Math.min(+e.target.max, +e.target.value)
    );
  };

  handleAltitudeTgtValueChange = value => {
    this.setState(
      prevstate => {
        prevstate.cmd.altitude = value;
        return prevstate;
      },
      () => {
        this.props.onChange(this.state.cmd);
      }
    );
  };

  handleSpeedTgtChange = e => {
    this.handleSpeedTgtValueChange(Math.min(+e.target.max, +e.target.value));
  };

  handleSpeedTgtValueChange = value => {
    this.setState(
      prevstate => {
        prevstate.cmd.speed = value;
        return prevstate;
      },
      () => {
        this.props.onChange(this.state.cmd);
      }
    );
  };

  handleDirectToTgtChange = e => {
    this.handleDirectToSelection(e.target.value);
  };

  handleDirectToSelection = value => {
    if (!this.state.cmd.tgt) return;
    this.setState(
      prevstate => {
        prevstate.cmd.direction = value.toUpperCase().trim();
        prevstate.cmd.directionOld = false;
        prevstate.cmd.heading = '';
        return prevstate;
      },
      () => {
        this.props.onChange(this.state.cmd);
      }
    );
  };

  handleTouchHeadingMode = () => {
    const airplane = this.state.cmd.tgt;
    const heading =
      typeof airplane.tgtDirection === 'number'
        ? airplane.tgtDirection
        : Math.round(airplane.heading);
    this.handleHeadingTgtValueChange(heading);
  };

  renderTrafficStack = () => {
    return GameStore.traffic.map((airplane, i) => (
      <TrafficStackEntry
        key={airplane.regNum}
        cmd={this.state.cmd}
        airplane={airplane}
        index={i}
        onClick={this.handleTrafficStackInfoButtonClick}
      />
    ));
  };

  getRoutes = () => {
    if (!this.state.cmd.tgt) return [];
    switch (this.state.cmd.tgt.routeType) {
    case routeTypes.INBOUND:
      return GameStore.parsedStars;
    case routeTypes.OUTBOUND:
      return GameStore.parsedSids;
    default:
      return [];
    }
  };

  renderIFRTrafficControl = () => {
    const cmd = this.props.cmd;
    const model = airplanesById[cmd.tgt.typeId];
    const topSpeed = model.topSpeed;
    const minSpeed = model.minSpeed;

    const landableRwyNamesArr = this.props.cmd.tgt
      ? landableRwys(
        GameStore.airport,
        this.props.cmd.tgt,
        config.width,
        config.height
      ).map(lr => (lr.rev ? lr.rwy.name2 : lr.rwy.name1))
      : [];
    const landableRwysArr = landableRwyNamesArr.map(name => (
      <option value={name} />
    ));
    const routeNames = SettingsStore.sidsStars
      ? Object.keys(this.getRoutes())
      : [];
    const routes = routeNames.map(name => <option value={name} />);

    const directToValue = cmd.directionOld ? '' : cmd.direction;
    const directToPlaceholder = cmd.directionOld ? cmd.direction : '';

    const allowedWaypoints = Object.keys(GameStore.waypoints).filter(
      x => GameStore.waypoints[x].type !== idType.DIRECTION
    );
    const touchWaypoints = Array.from(
      new Set(landableRwyNamesArr.concat(allowedWaypoints, routeNames))
    ).sort();
    const headingValue = Number.isFinite(cmd.heading)
      ? cmd.heading
      : typeof cmd.tgt.tgtDirection === 'number'
        ? cmd.tgt.tgtDirection
        : Math.round(cmd.tgt.heading);
    const speedValue = Number.isFinite(cmd.speed) ? cmd.speed : cmd.tgt.speed;
    const altitudeValue = Number.isFinite(cmd.altitude)
      ? cmd.altitude
      : cmd.tgt.altitude;
    const directToSelection = cmd.directionOld ? '' : cmd.direction;

    return (
      <div className="ifr-command-controls">
        <div className="desktop-command-controls">
          <div>
            <span>Heading (°)</span>
            <input
              onInput={this.handleHeadingTgtChange}
              value={cmd.heading}
              type="number"
              step="5"
            />
          </div>
          <div>
            <span>Direct to </span>
            <input
              className="direct-to-input"
              type="text"
              value={directToValue}
              placeholder={directToPlaceholder}
              list={this.dtcToDataListId}
              onInput={this.handleDirectToTgtChange}
            />
            <datalist id={this.dtcToDataListId}>
              {cmd.tgt.routeType === routeTypes.INBOUND
                ? landableRwysArr
                : null}
              {allowedWaypoints.map(w => (
                <option key={w} value={w} />
              ))}
              {routes}
            </datalist>
          </div>
          <div>
            <span>Speed (KTS)</span>
            <input
              onInput={this.handleSpeedTgtChange}
              value={cmd.speed}
              type="number"
              min={minSpeed}
              max={topSpeed}
              step="10"
            />
          </div>
          <div>
            <span>Altitude (FT)</span>
            <input
              onInput={this.handleAltitudeTgtChange}
              value={cmd.altitude}
              type="number"
              min="2000"
              max={model.ceiling * 1000}
              step="1000"
            />
          </div>
          <div>
            <button onClick={this.props.onCmdExecution}>
              <FaPaperPlane /> Give Command
            </button>
          </div>
        </div>

        <div
          className="touch-command-controls"
          style={`--touch-control-color:${SettingsStore.touchControlColor};`}
        >
          <div className="touch-waypoint-picker">
            <div className="touch-command-section-title">
              Fix / waypoint
              <span>{directToSelection || 'HEADING'}</span>
            </div>
            <div
              className="touch-waypoint-list"
              role="listbox"
              aria-label="Select a fix or waypoint"
            >
              <button
                type="button"
                className={directToSelection ? '' : 'selected'}
                onClick={this.handleTouchHeadingMode}
                aria-selected={!directToSelection}
              >
                HDG
              </button>
              {touchWaypoints.map(waypoint => (
                <button
                  type="button"
                  key={waypoint}
                  className={
                    directToSelection === waypoint ? 'selected' : ''
                  }
                  onClick={() => this.handleDirectToSelection(waypoint)}
                  aria-selected={directToSelection === waypoint}
                >
                  {waypoint}
                </button>
              ))}
            </div>
          </div>
          <div className="touch-command-grid">
            <TouchDial
              label="Heading"
              unit="°"
              value={headingValue}
              min={5}
              max={360}
              step={5}
              digits={3}
              wrap
              color={SettingsStore.touchControlColor}
              onChange={this.handleHeadingTgtValueChange}
            />
            <TouchDial
              label="Speed"
              unit="KT"
              value={speedValue}
              min={minSpeed}
              max={topSpeed}
              step={10}
              digits={3}
              color={SettingsStore.touchControlColor}
              onChange={this.handleSpeedTgtValueChange}
            />
            <TouchDial
              label="Altitude"
              unit="FT"
              value={altitudeValue}
              min={2000}
              max={model.ceiling * 1000}
              step={1000}
              digits={5}
              color={SettingsStore.touchControlColor}
              onChange={this.handleAltitudeTgtValueChange}
            />
            <button
              type="button"
              className="touch-command-send"
              onClick={this.props.onCmdExecution}
            >
              <FaPaperPlane />
              <span>Send</span>
              <small>Command</small>
            </button>
          </div>
        </div>

        <div className="command-secondary-actions">
          <button
            onClick={this.handleTakeoffTrigger}
            className={cmd.tgt.waiting ? '' : 'hidden'}
          >
            <FaPlane /> Takeoff
          </button>
          {cmd.tgt.routeType === routeTypes.INBOUND &&
          landableRwysArr.length > 0 &&
          landableRwyNamesArr.includes(cmd.tgt.tgtDirection) ? (
              <button onClick={this.handleGoAroundClick}>
                <FaPlane /> Go Around
              </button>
            ) : null}
          {cmd.tgt.routeType === routeTypes.INBOUND &&
          landableRwysArr.length > 0 &&
          landableRwyNamesArr.includes(cmd.tgt.tgtDirection) === false
            ? <span>Choose a runway or fix to set the route.</span>
            : null}
        </div>
      </div>
    );
  };

  handleVFRTgtState = value => {
    this.setState(
      prevstate => {
        prevstate.cmd.tgtVfrState = value;
        return prevstate;
      },
      () => {
        this.props.onChange(this.state.cmd);
      }
    );
  };

  handleGoAroundUpwindClick = e => {
    this.setState(
      prevstate => {
        prevstate.cmd.goAroundVFR = true;
        return prevstate;
      },
      () => {
        this.props.onChange(this.state.cmd);
        this.props.onCmdExecution();
      }
    );
    // TODO: Speech
  };

  renderVFRTrafficControl() {
    const cmd = this.props.cmd;
    const routeType = cmd.tgt.routeType;
    const routeContent = vfrRouteContent[routeType] || {
      kicker: 'General aviation',
      title: 'Choose an instruction',
      hint: 'Select the instruction to issue to this aircraft.'
    };
    const instructions = allowedVFRStates(cmd.tgt) || [];
    const currentInstruction =
      vfrInstructionContent[this.state.cmd.tgtVfrState];
    const runwayOptions = activeRwys(GameStore.airport, GameStore.winddir);
    const requiresRunway =
      routeType === routeTypes.VFR_INBOUND ||
      routeType === routeTypes.VFR_INBOUND_TG;
    const selectedRunway = runwayOptions.includes(cmd.direction)
      ? cmd.direction
      : runwayOptions.includes(cmd.tgt.tgtDirection)
        ? cmd.tgt.tgtDirection
        : '';
    const assignedRunway = cmd.tgt.rwy || selectedRunway;
    const commandDisabled = requiresRunway && !selectedRunway;
    const primaryLabel = cmd.tgt.waiting
      ? 'Clear for takeoff'
      : commandDisabled
        ? 'Choose a runway'
        : 'Send instruction';

    return (
      <div className="vfr-command-controls">
        <header className="vfr-command-header">
          <span>{routeContent.kicker}</span>
          <strong>{routeContent.title}</strong>
          <small>{routeContent.hint}</small>
        </header>

        {requiresRunway ? (
          <fieldset className="vfr-command-group vfr-runway-group">
            <legend>1 · Select runway</legend>
            <div className="vfr-runway-options">
              {runwayOptions.map(runway => (
                <button
                  type="button"
                  key={runway}
                  className={selectedRunway === runway ? 'selected' : ''}
                  aria-pressed={selectedRunway === runway}
                  onClick={() => this.handleDirectToSelection(runway)}
                >
                  RWY {runway}
                </button>
              ))}
            </div>
          </fieldset>
        ) : assignedRunway ? (
          <div className="vfr-runway-assignment">
            <span>Assigned runway</span>
            <strong>RWY {assignedRunway}</strong>
          </div>
        ) : null}

        <fieldset className="vfr-command-group">
          <legend>{requiresRunway ? '2' : '1'} · Select instruction</legend>
          <div className="vfr-instruction-options">
            {instructions.map(state => {
              const content = vfrInstructionContent[state] || {
                label: VFRStates[state],
                description: 'Issue this traffic instruction.'
              };
              const selected = this.state.cmd.tgtVfrState === state;
              return (
                <button
                  type="button"
                  key={state}
                  className={selected ? 'selected' : ''}
                  aria-pressed={selected}
                  onClick={() => this.handleVFRTgtState(state)}
                >
                  <strong>{content.label}</strong>
                  <small>{content.description}</small>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="vfr-command-summary" aria-live="polite">
          <span>Ready to issue</span>
          <strong>
            {currentInstruction
              ? currentInstruction.label
              : 'Select an instruction'}
            {selectedRunway ? ` · RWY ${selectedRunway}` : ''}
          </strong>
        </div>

        <div className="vfr-command-actions">
          <button
            type="button"
            className="vfr-command-primary"
            disabled={commandDisabled}
            onClick={cmd.tgt.waiting
              ? this.handleTakeoffTrigger
              : this.props.onCmdExecution}
          >
            {cmd.tgt.waiting ? <FaPlane /> : <FaPaperPlane />}
            {primaryLabel}
          </button>
          {cmd.tgt.landing === true && cmd.tgt.dirty === true ? (
            <button
              type="button"
              className="vfr-command-secondary"
              onClick={this.handleGoAroundUpwindClick}
            >
              <FaPlane /> Go Around
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  handleAirplaneClick = cmd => {
    this.setState({
      textCmd: communications.getCallsign(cmd.tgt, true) + ' '
    });
  };

  handleTextCmdChange = e => {
    this.setState({
      textCmd: e.target.value
    });
  };

  onCmdTextParse = () => {
    const cmd = parse(GameStore.traffic, this.state.textCmd, this.state.cmd);
    if (!cmd)
      return sendMessageError(
        `"${this.state.textCmd.trim()}". Format is wrong`
      );
    this.props.onChange(cmd);
    this.props.onCmdExecution();
    this.setState({
      cmd: cmd,
      textCmd: communications.getCallsign(cmd.tgt, true) + ' '
    });
  };

  renderTextCmdControl = () => {
    return (
      <div>
        <div>
          <span>
            Text command{' '}
            <button
              onClick={() => route('/tutorials/text-commands')}
              class="question-mark-btn"
            >
              ?
            </button>
          </span>
          <input
            className="text-cmd"
            type="text"
            value={this.state.textCmd}
            placeholder=""
            onInput={this.handleTextCmdChange}
            style="text-transform:uppercase"
          />
        </div>
        <div>
          <button onClick={this.onCmdTextParse}>
            <FaPaperPlane /> Give Command
          </button>
        </div>
      </div>
    );
  };

  renderUtilityMenu = mobile => (
    <div
      id={mobile ? 'mobile-utility-menu' : null}
      className={mobile ? 'mobile-utility-menu' : 'atc-view-buttons'}
      role={mobile ? 'dialog' : null}
      aria-modal={mobile ? 'true' : null}
      aria-labelledby={mobile ? 'mobile-utility-menu-title' : null}
      ref={element => {
        if (mobile) this.mobileMenuDialog = element;
      }}
    >
      {mobile ? (
        <header className="mobile-utility-menu-header">
          <div>
            <span>Simulation Hold</span>
            <h2 id="mobile-utility-menu-title">Session Menu</h2>
          </div>
          <button
            type="button"
            className="mobile-utility-menu-close"
            aria-label="Close game menu"
            onClick={() => this.closeMobileMenu()}
          >
            <FaTimes />
          </button>
        </header>
      ) : null}
      <button
        className="w-100"
        onClick={this.handleExpandSettingsButtonClick}
      >
        <FaCog />
        &nbsp;
        {this.state.settingsExpanded ? 'Close options' : 'Options'}
      </button>
      <button className="w-100" onClick={this.handleLogsExpanded}>
        <FaCommentDots />
        &nbsp;
        {this.state.logsExpanded ? 'Close logs' : 'Logs'}
      </button>
      <button className="w-100" onClick={this.handleAboutExpanded}>
        <FaQuestion />
        &nbsp;
        {this.state.aboutExpanded ? 'Close about' : 'About'}
      </button>
      <button className="w-100" onClick={this.handleInfoExpanded}>
        <FaInfo />
        &nbsp;
        {this.state.infoExpanded ? 'Close airfield' : 'Airfield info'}
      </button>
      <GameMetaControls
        onPauseResume={mobile ? this.handleMobilePauseExit : null}
      />
    </div>
  );

  render() {
    const trafficStack = this.renderTrafficStack();
    const hours = Math.floor(GameStore.time / 3600);
    const minutes = Math.floor((GameStore.time % 3600) / 60);
    const mobileSession = isMobileSession();
    const majorAirportLayout = GameStore.map &&
      GameStore.map.commercial > 0 &&
      (!SettingsStore.ga || GameStore.map.commercial >= GameStore.map.ga);

    const trafficControl = SettingsStore.useTextCmd
      ? this.renderTextCmdControl()
      : this.state.cmd.tgt
        ? Airplane.isVFR(this.state.cmd.tgt)
          ? this.renderVFRTrafficControl()
          : this.renderIFRTrafficControl()
        : null;

    return (
      <div
        className={`traffic-stack-shell ${
          majorAirportLayout ? 'major-airport-layout' : 'ga-airport-layout'
        }`}
      >
        <div className="mobile-game-navbar">
          <div
            className="mobile-game-status"
            aria-label="Current weather and time"
          >
            <span>
              Wind {lpad(`${Math.floor(GameStore.winddir)}`, '0', 3)}° ·{' '}
              {Math.floor(GameStore.windspd)} KT
            </span>
            <time>{lpad(`${hours}`, '0', 2)}:{lpad(`${minutes}`, '0', 2)}</time>
          </div>
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={this.handleMobileMenuToggle}
            aria-controls="mobile-utility-menu"
            aria-expanded={this.state.mobileMenuExpanded}
            aria-label={
              this.state.mobileMenuExpanded
                ? 'Close game menu'
                : 'Open game menu'
            }
            ref={element => { this.mobileMenuToggle = element; }}
          >
            {this.state.mobileMenuExpanded ? <FaTimes /> : <FaBars />}
            <span>{this.state.mobileMenuExpanded ? 'Close' : 'Menu'}</span>
          </button>
        </div>
        <div className="traffic-stack-wrapper">
          <div
            className="traffic-stack"
            onClick={this.props.onClick}
          >
            <div className="wind">
              wind: {Math.floor(GameStore.winddir)}° @{' '}
              {Math.floor(GameStore.windspd)}KTS
            </div>
            <div className="time">
              time: {hours}:{lpad(`${minutes}`, '0', 2)}
            </div>
            {trafficStack}
          </div>
          <div
            className={`traffic-control ${
              SettingsStore.useTextCmd ? 'text-command-control' : ''
            }`}
          >
            {trafficControl}
          </div>
          {!mobileSession ? this.renderUtilityMenu(false) : null}
        </div>

        {mobileSession && this.state.mobileMenuExpanded
          ? createPortal(
            <div
              className="mobile-utility-menu-overlay"
              onClick={this.handleMobileMenuBackdrop}
            >
              {this.renderUtilityMenu(true)}
            </div>,
            document.body
          )
          : null}

        {/* panels */}
        <SettingsPanel
          expanded={this.state.settingsExpanded}
          onToggle={this.handleExpandSettingsButtonClick}
        />
        <AirplaneInfoPanel
          infoPanelTgt={this.state.infoPanelTgt}
          onToggle={this.handleCloseAirplaneInfoPanel}
        />
        <LogsPanel
          expanded={this.state.logsExpanded}
          onToggle={this.handleLogsExpanded}
        />
        <InfoPanel
          expanded={this.state.infoExpanded}
          onToggle={this.handleInfoExpanded}
        />
        <AboutPanel
          expanded={this.state.aboutExpanded}
          onToggle={this.handleAboutExpanded}
        />
      </div>
    );
  }
}

export default TrafficStack;
