import { Component } from 'preact';
import './RouteVisualizer.css';
import GameStore from '../../stores/GameStore';
import { svgPath } from '../../lib/svg';
import config from '../../lib/config';
import Airplane from '../../lib/airplane';
import SettingsStore from '../../stores/SettingsStore';
import { groundVelocity } from '../../lib/weather';

class RouteVisualizer extends Component {
  getPoints = () => {
    const tgt = this.props.cmd.tgt;
    if (!tgt) return [];
    const { x, y } = tgt;
    if (typeof tgt.tgtDirection === 'string') {
      if (Airplane.isVFR(tgt) || !SettingsStore.routeVisualization) return [];
      const callsign = GameStore.callsigns[tgt.tgtDirection];
      const dir = GameStore.callsignsPos[tgt.tgtDirection];
      if (!callsign || !dir || callsign.class === 'route') return [];
      return [{ 0: x, 1: y }, { 0: dir.x, 1: dir.y }];
    } else if (typeof tgt.tgtDirection === 'number') {
      const heightAboveAirport = tgt.altitude - (GameStore.airport.elevation || 0);
      const windEffect = Math.max(0, Math.min(1, heightAboveAirport / 1000));
      const velocity = groundVelocity(
        tgt.tgtDirection,
        tgt.speed,
        GameStore.winddir,
        GameStore.windspd,
        windEffect
      );
      const projection = config.baseAirplaneSpeed * config.vectorLookaheadSeconds;
      const vr = [x + velocity.x * projection, y + velocity.y * projection];
      return [{ 0: x, 1: y }, { 0: vr[0], 1: vr[1] }];
    }
    return [];
  };

  render() {
    const points = this.getPoints();
    if (points.length < 2) return null;
    const zoom = GameStore.zoom;
    const path = svgPath(
      points.map(p => [
        (p[0] - config.width / 2) * zoom + config.width / 2,
        (config.height / 2 - p[1]) * zoom + config.height / 2
      ])
    );
    return (
      <g className="RouteVisualizer" aria-label="Selected aircraft projected track">
        <path d={path} class="plane-path ground-track-vector" />
      </g>
    );
  }
}

export default RouteVisualizer;
