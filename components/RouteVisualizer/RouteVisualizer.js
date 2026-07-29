import { Component } from 'preact';
import './RouteVisualizer.css';
import GameStore from '../../stores/GameStore';
import { svgPath } from '../../lib/svg';
import config from '../../lib/config';
import { hdgToVector } from '../../lib/map';
import Airplane from '../../lib/airplane';
import SettingsStore from '../../stores/SettingsStore';

class RouteVisualizer extends Component {
  getPoints = () => {
    const tgt = this.props.cmd.tgt;
    if (!tgt || Airplane.isVFR(tgt)) return [];
    const { x, y } = tgt;
    if (typeof tgt.tgtDirection === 'string') {
      const callsign = GameStore.callsigns[tgt.tgtDirection];
      const dir = GameStore.callsignsPos[tgt.tgtDirection];
      if (!callsign || !dir || callsign.class === 'route') return [];
      return [{ 0: x, 1: y }, { 0: dir.x, 1: dir.y }];
    } else if (typeof tgt.tgtDirection === 'number') {
      const v = hdgToVector(tgt.tgtDirection);
      const vlen = 10000;
      const vr = [v[0] * vlen + x, v[1] * vlen + y];
      return [{ 0: x, 1: y }, { 0: vr[0], 1: vr[1] }];
    }
    return [];
  };

  render() {
    if (!SettingsStore.routeVisualization) return null;
    const zoom = GameStore.zoom;
    const path = svgPath(
      this.getPoints().map(p => [
        (p[0] - config.width / 2) * zoom + config.width / 2,
        (config.height / 2 - p[1]) * zoom + config.height / 2
      ])
    );
    return (
      <g className="RouteVisualizer">
        <path d={path} class="plane-path" stroke="brown" />
      </g>
    );
  }
}

export default RouteVisualizer;
