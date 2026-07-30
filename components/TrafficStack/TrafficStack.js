import { Component } from 'preact';
import {
  FaInfo,
  FaCommentDots,
  FaCog,
  FaPlane,
  FaPaperPlane,
  FaQuestion
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

class TrafficStack extends Component {
  constructor(props) {
    super();
    this.state = {
      settingsExpanded: false,
      logsExpanded: false,
      aboutExpanded: false,
      infoExpanded: false,
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
  }

  handleKeyPress = e => {
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
    this.setState({ settingsExpanded: !this.state.settingsExpanded }, () =>
      this.props.onChange(this.state.cmd)
    );
  };

  handleAboutExpanded = () => {
    this.setState({ aboutExpanded: !this.state.aboutExpanded });
  };

  handleLogsExpanded = () => {
    this.setState({ copied: false, logsExpanded: !this.state.logsExpanded });
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
    this.setState({ infoExpanded: !this.state.infoExpanded });
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

  getDctName = airplane => {
    switch (airplane.routeType) {
    case routeTypes.VFR_CLOSED_PATTERN:
      return 'Runway';
    default:
      return 'WIP';
    }
  };

  handleVFRTgtState = e => {
    this.setState(
      prevstate => {
        prevstate.cmd.tgtVfrState = +e.target.value;
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
    const dctName = this.getDctName(cmd.tgt);

    const directToValue = cmd.directionOld ? '' : cmd.direction;
    const directToPlaceholder = cmd.directionOld ? cmd.direction : '';

    const hideDirectionInput =
      cmd.tgt.routeType === routeTypes.VFR_ENROUTE ||
      cmd.tgt.routeType == routeTypes.VFR_OUTBOUND;

    return (
      <div>
        <div className={hideDirectionInput ? 'hidden' : ''}>
          <span>{dctName} </span>
          <input
            className="direct-to-input"
            type="text"
            value={directToValue}
            placeholder={directToPlaceholder}
            list={this.dtcToDataListId}
            onInput={this.handleDirectToTgtChange}
          />
          <datalist id={this.dtcToDataListId}>
            {activeRwys(GameStore.airport, GameStore.winddir)}
          </datalist>
        </div>
        <div>
          <span>State </span>
          <select
            className="state-input"
            onInput={this.handleVFRTgtState}
            value={this.state.cmd.tgtVfrState}
          >
            {allowedVFRStates(this.state.cmd.tgt).map(x => (
              <option key={x} value={x}>{VFRStates[x]}</option>
            ))}
          </select>
        </div>
        <div>
          <button onClick={this.props.onCmdExecution}>
            <FaPaperPlane /> Give Command
          </button>
        </div>
        <div>
          <button
            onClick={this.handleTakeoffTrigger}
            className={cmd.tgt.waiting ? '' : 'hidden'}
          >
            <FaPlane /> Takeoff
          </button>
        </div>
        <div>
          {cmd.tgt.landing === true && cmd.tgt.dirty === true ? (
            <button onClick={this.handleGoAroundUpwindClick}>
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

  render() {
    const trafficStack = this.renderTrafficStack();

    const trafficControl = SettingsStore.useTextCmd
      ? this.renderTextCmdControl()
      : this.state.cmd.tgt
        ? Airplane.isVFR(this.state.cmd.tgt)
          ? this.renderVFRTrafficControl()
          : this.renderIFRTrafficControl()
        : null;

    return (
      <div className="traffic-stack-shell">
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
              time: {Math.floor(GameStore.time / 3600)}:
              {Math.floor((GameStore.time % 3600) / 60)}
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
          <div className="atc-view-buttons">
            <button
              className="w-100"
              onClick={this.handleExpandSettingsButtonClick}
            >
              <FaCog />
              &nbsp;
              {this.state.settingsExpanded ? 'Hide options' : 'Expand options'}
            </button>
            <button className="w-100" onClick={this.handleLogsExpanded}>
              <FaCommentDots />
              &nbsp;
              {this.state.logsExpanded ? 'Hide logs' : 'Expand logs'}
            </button>
            <button className="w-100" onClick={this.handleAboutExpanded}>
              <FaQuestion />
              &nbsp;
              {this.state.aboutExpanded ? 'Hide about' : 'Expand about'}
            </button>
            <button className="w-100" onClick={this.handleInfoExpanded}>
              <FaInfo />
              &nbsp;
              {this.state.infoExpanded ? 'Hide info' : 'Expand info'}
            </button>
            <GameMetaControls />
          </div>
        </div>

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
