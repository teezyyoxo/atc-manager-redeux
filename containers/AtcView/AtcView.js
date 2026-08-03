import { Component } from 'preact';
import './AtcView.css';
import GameStore from '../../stores/GameStore';
import { airplanesById } from '../../lib/airplane-library/airplane-library';
import Communications from '../../lib/communications';
import SettingsStore from '../../stores/SettingsStore';
import TrafficStack from '../../components/TrafficStack/TrafficStack';
import ActionContextMenu from '../../components/ActionContextMenu/ActionContextMenu';
import SvgRadar from '../../components/SvgRadar/SvgRadar';
import { sendMessageWarning } from '../../components/GameMessages/GameMessages';
import communications from '../../lib/communications';
import { EventEmitter } from 'events';
import Airplane from '../../lib/airplane';
import { rwyHeading } from '../../lib/map';
import { isMobileSession } from '../../lib/mobile';

class AtcView extends Component {
  constructor(props) {
    super();
    this.state = {
      logsOnlySelf: false,
      infoPanelTgt: null,
      actionMenu: null,

      cmd: {
        tgt: null,
        heading: null,
        altitude: null,
        direction: null,
        speed: null,
        directionOld: null
      }
    };

    this.emitter = new EventEmitter();
    this.pinchDistance = null;
  }

  componentDidMount() {
    GameStore.on('change', this.handleGameStoreChange);
    if (typeof window !== 'undefined') {
      document.addEventListener('click', this.handleDocumentClick);
      window.addEventListener('beforeunload', this.handleBeforeUnload);
    }
    if (isMobileSession() && GameStore.traffic.length > 0) {
      this.handleAirplaneClick(0);
    }
  }

  componentWillUnmount() {
    GameStore.removeListener('change', this.handleGameStoreChange);
    if (typeof window !== 'undefined') {
      document.removeEventListener('click', this.handleDocumentClick);
      window.removeEventListener('beforeunload', this.handleBeforeUnload);
    }
  }

  handleBeforeUnload = e => {
    if (!GameStore.started) return;
    e.preventDefault();
    e.returnValue = '';
  };

  handleDocumentClick = () => {
    this.setState({ actionMenu: null });
  };

  handleGameStoreChange = () => {
    if (
      this.state.cmd.tgt &&
      !GameStore.traffic.includes(this.state.cmd.tgt)
    ) {
      if (isMobileSession() && GameStore.traffic.length > 0) {
        this.handleAirplaneClick(0);
        return;
      }
      this.setState({
        cmd: {
          tgt: null,
          heading: null,
          altitude: null,
          direction: null,
          speed: null,
          directionOld: null
        }
      });
      return;
    }
    if (
      !this.state.cmd.tgt &&
      isMobileSession() &&
      GameStore.traffic.length > 0
    ) {
      this.handleAirplaneClick(0);
      return;
    }
    this.setState({});
  };

  handleWaypointContextMenu = (e, waypoint, id) => {
    if (!this.state.cmd.tgt) return;
    if (Airplane.isVFR(this.state.cmd.tgt)) return;
    e.preventDefault();
    const actions = [
      {
        getTitle: () => `Direct to ${id}`,
        action: () =>
          this.setState(
            prevstate => {
              prevstate.cmd.direction = id;
              prevstate.cmd.directionOld = false;
              prevstate.actionMenu = null;
              return prevstate;
            },
            () => this.handleCmdExecution()
          )
      }
    ];

    this.setState({
      actionMenu: {
        left: e.pageX,
        top: e.pageY,
        actions
      }
    });
  };

  handleSVGClick = e => {
    const airplane = getParent(
      e,
      element =>
        (element.getAttribute('class') || '').indexOf('airplane') !== -1
    );
    if (!airplane) return;
    const index = airplane.getAttribute('data-index');
    this.handleAirplaneClick(index);
  };

  handleTrafficStackClick = e => {
    const airplane = getParent(
      e,
      element =>
        (element.getAttribute('class') || '').indexOf('traffic-stack-entry') !==
        -1
    );
    if (!airplane) return;
    const index = airplane.getAttribute('data-index');
    this.handleAirplaneClick(index);
  };

  handleAirplaneClick = index => {
    const airplane = GameStore.traffic[index];
    if (!airplane) return;
    if (airplane === this.state.cmd.tgt) {
      airplane.textRotation = (airplane.textRotation || 0) + 1;
      airplane.textRotation %= 4;
      this.setState({});
      return;
    }
    // if (this.state.cmd.tgt) this.handleCmdExecution(); // flush possible previous changes that werent yet debounced.
    this.setState(
      {
        cmd: {
          tgt: airplane,
          direction:
            typeof airplane.tgtDirection === 'string'
              ? airplane.tgtDirection
              : null,
          altitude: airplane.tgtAltitude,
          heading:
            typeof airplane.tgtDirection === 'number'
              ? airplane.tgtDirection
              : null,
          speed: airplane.tgtSpeed,
          tgtVfrState: airplane.tgtVfrState
        }
      },
      () => {
        this.emitter.emit('cmdtgt', this.state.cmd);
      }
    );
  };

  handleCmdExecution = () => {
    const cmd = this.state.cmd;
    if (!cmd.tgt) return;
    const delta = {};
    const model = airplanesById[cmd.tgt.typeId];
    if (cmd.goAround) {
      var rwyHdg = rwyHeading(
        GameStore.callsignsPos[cmd.tgt.tgtDirection],
        cmd.tgt.tgtDirection
      );
      cmd.direction = '';
      delta.tgtDirection = rwyHdg;
      cmd.heading = null;
    }
    if (typeof cmd.heading === 'number') {
      cmd.heading = ((cmd.heading + 359) % 360) + 1;
    }
    if (cmd.direction && cmd.directionOld === false) {
      if (GameStore.callsigns[cmd.direction]) {
        if (cmd.direction !== cmd.tgt.tgtDirection)
          delta.tgtDirection = cmd.direction;
        cmd.directionOld = true;
        cmd.heading = '';
      }
    } else if (
      typeof cmd.heading === 'number' &&
      cmd.heading !== cmd.tgt.tgtDirection
    ) {
      delta.tgtDirection = cmd.heading;
      cmd.direction = '';
    }
    if (
      typeof cmd.altitude === 'number' &&
      !Airplane.isVFR(cmd.tgt) &&
      cmd.altitude !== cmd.tgt.tgtAltitude
    ) {
      delta.tgtAltitude = cmd.altitude = Math.min(
        model.ceiling * 1000,
        Math.max(2000, cmd.altitude)
      );
    }
    if (cmd.speed && cmd.speed > 250 && cmd.tgt.altitude < 10000) {
      cmd.speed = 250;
    }
    if (cmd.speed && cmd.speed !== cmd.tgt.tgtSpeed)
      delta.tgtSpeed = cmd.speed = Math.min(
        model.topSpeed,
        Math.max(model.minSpeed, cmd.speed)
      );
    if (cmd.takeoff && cmd.tgt.rwy) {
      const rwyWaitingOn = GameStore.rwyWaitingOn(cmd.tgt);
      if (rwyWaitingOn.length > 0) {
        sendMessageWarning(
          `${communications.getCallsign(
            cmd.tgt,
            true
          )} cannot takeoff, they are behind ${communications.getCallsign(
            rwyWaitingOn.pop(),
            true
          )}`
        );
        return;
      }
      delta.waiting = false;
    }
    if (cmd.goAroundVFR) {
      delta.dirty = false;
    }
    if (
      typeof cmd.tgtVfrState === 'number' &&
      cmd.tgtVfrState !== cmd.tgt.tgtVfrState
    )
      delta.tgtVfrState = cmd.tgtVfrState;
    if (Object.keys(delta).length > 0) {
      var cmdTxt = Communications.getCommandText(
        cmd,
        GameStore.winddir,
        GameStore.windspd,
        GameStore.map,
        GameStore.callsignsPos
      );
      const atcMsg = Communications.getCallsign(cmd.tgt) + ', ' + cmdTxt;
      GameStore.addLog(atcMsg, 'ATC');
      // pilot:
      const pilotMsg = cmdTxt + ', ' + Communications.getCallsign(cmd.tgt);
      GameStore.addLog(pilotMsg, Communications.getCallsign(cmd.tgt, true));

      if (SettingsStore.speechsynthesis) Communications.speak(atcMsg);
      Object.assign(cmd.tgt, delta);
      this.setState({ cmd });
      this.emitter.emit('cmdexecution', cmd);
    } else {
      // do nothing
    }
    if (cmd.takeoff) {
      delete cmd.takeoff;
    }
    if (cmd.goAroundVFR) {
      delete cmd.goAroundVFR;
    }
    if (cmd.goAround) {
      delete cmd.goAround;
    }
  };

  handleZoom = e => {
    GameStore.adjustZoom(-e.deltaY);
  };

  handleTouchStart = e => {
    if (e.touches.length !== 2) return;
    this.pinchDistance = touchDistance(e.touches);
  };

  handleTouchMove = e => {
    if (e.touches.length !== 2 || this.pinchDistance === null) return;
    e.preventDefault();
    const distance = touchDistance(e.touches);
    GameStore.adjustZoom(distance - this.pinchDistance);
    this.pinchDistance = distance;
  };

  handleTouchEnd = () => {
    this.pinchDistance = null;
  };

  handleCmdChange = cmd => {
    this.setState({ cmd });
  };

  render() {
    return (
      <div className="atc-view">
        <SvgRadar
          onZoom={this.handleZoom}
          onTouchStart={this.handleTouchStart}
          onTouchMove={this.handleTouchMove}
          onTouchEnd={this.handleTouchEnd}
          onClick={this.handleSVGClick}
          cmd={this.state.cmd}
          emitter={this.emitter}
          onWayPointContextMenu={this.handleWaypointContextMenu}
        />

        <TrafficStack
          cmd={this.state.cmd}
          onChange={this.handleCmdChange}
          onCmdExecution={this.handleCmdExecution}
          emitter={this.emitter}
          onClick={this.handleTrafficStackClick}
        />

        {this.state.actionMenu && (
          <ActionContextMenu {...this.state.actionMenu} />
        )}
      </div>
    );
  }
}

const getParent = (e, matcher) => {
  let el = e.target;
  while (el) {
    if (matcher(el)) return el;
    el = el.parentElement;
  }
  return null;
};

const touchDistance = touches => {
  const x = touches[0].clientX - touches[1].clientX;
  const y = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(x * x + y * y);
};

export default AtcView;
