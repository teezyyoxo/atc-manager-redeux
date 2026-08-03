import { Component } from 'preact';
import './TrafficStackEntry.css';
import { routeTypes, airplanesById } from '../../lib/airplane-library/airplane-library';
import PlaneSpd from '../PlaneSpd/PlaneSpd';
import PlaneAlt from '../PlaneAlt/PlaneAlt';
import communications from '../../lib/communications';
import SettingsStore from '../../stores/SettingsStore';
import {
  FaArrowRight,
  FaPlane,
  FaPlaneArrival,
  FaPlaneDeparture,
  FaSyncAlt
} from 'react-icons/fa/index.esm';

const getPlaneColor = airplane => {
  switch (airplane.routeType) {
    case routeTypes.ENROUTE:
      return SettingsStore.enrouteTrafficColor;
    case routeTypes.OUTBOUND:
      return SettingsStore.outboundTrafficColor;
    case routeTypes.INBOUND:
      return SettingsStore.inboundTrafficColor;
    default:
      return SettingsStore.vfrTrafficColor;
  }
};

const getTrafficRole = routeType => {
  switch (routeType) {
    case routeTypes.INBOUND:
    case routeTypes.VFR_INBOUND:
    case routeTypes.VFR_INBOUND_TG:
      return {
        className: 'arrival',
        icon: FaPlaneArrival,
        label: 'Arrival'
      };
    case routeTypes.OUTBOUND:
    case routeTypes.VFR_OUTBOUND:
      return {
        className: 'departure',
        icon: FaPlaneDeparture,
        label: 'Departure'
      };
    case routeTypes.ENROUTE:
    case routeTypes.VFR_ENROUTE:
      return {
        className: 'enroute',
        icon: FaArrowRight,
        label: 'Enroute'
      };
    case routeTypes.VFR_CLOSED_PATTERN:
    case routeTypes.VFR_CLOSED_PATTERN_TG:
      return {
        className: 'local',
        icon: FaSyncAlt,
        label: 'Local pattern'
      };
    default:
      return {
        className: 'traffic',
        icon: FaPlane,
        label: 'Traffic'
      };
  }
};

class TrafficStackEntry extends Component {
  render() {
    const airplane = this.props.airplane;
    const spd = <PlaneSpd airplane={airplane} tagName="span" />;
    const alt = <PlaneAlt airplane={airplane} tagName="span" />;
    const heading = `000${Math.floor(airplane.heading)}`.substr(-3) + '°';
    const direction =
      airplane.heading === airplane.tgtDirection
        ? null
        : '⇨' +
        (typeof airplane.tgtDirection === 'string'
          ? `${airplane.tgtDirection}`
          : `000${Math.floor(airplane.tgtDirection)}`.substr(-3)) +
        '°';
    const model = airplanesById[airplane.typeId];
    const routeName = routeTypes[airplane.routeType] || 'traffic';
    const trafficRole = getTrafficRole(airplane.routeType);
    const TrafficRoleIcon = trafficRole.icon;
    const color = getPlaneColor(airplane);

    return (
      <div style={`background-color: ${color};`}
        className={`traffic-stack-entry ${routeName.replace(/ /g, '-')} ${
          this.props.cmd.tgt === airplane
            ? 'traffic-active'
            : 'traffic-not-active'
        }`}
        data-index={this.props.index}
      >
        <span
          className={`traffic-role-marker traffic-role-${
            trafficRole.className
          }`}
          aria-label={`${trafficRole.label} traffic`}
          title={`${trafficRole.label} traffic`}
        >
          <TrafficRoleIcon aria-hidden="true" focusable="false" />
          <span className="visually-hidden">{trafficRole.label}</span>
        </span>{' '}
        {communications.getCallsign(airplane, true)}{' '}
        {model && model.shortName ? model.shortName : 'A/C'} {spd}{' '}
        {alt} {heading}
        {direction}
        {airplane.outboundWaypoint ? ` ⇨${airplane.outboundWaypoint}` : null}
        {airplane.rwy ? <span> RWY {airplane.rwy}</span> : null}
        {airplane.tgs !== undefined && airplane.tgs > 0
          ? ` TGL ${airplane.tgs}`
          : null}
        <button
          onClick={this.props.onClick}
          className="airplane-traffic-stack-info-btn"
          aria-label={`Show details for ${communications.getCallsign(
            airplane,
            true
          )}`}
        >
          ?
        </button>
      </div>
    );
  }
}

export default TrafficStackEntry;
