import { Component } from 'preact';
import './MapViewControl.css';
import SettingsStore from '../../stores/SettingsStore';

export const mapViewOptions = [
  { value: 'radar', label: 'Radar', description: 'Scope only' },
  { value: 'street', label: 'Street', description: 'Roads + places' },
  { value: 'terrain', label: 'Terrain', description: 'Land + water' },
  { value: 'satellite', label: 'Satellite', description: 'Aerial imagery' }
];

class MapViewControl extends Component {
  handleChange = mapView => {
    SettingsStore.setMapView(mapView);
  };

  render() {
    const compact = !!this.props.compact;
    return (
      <div
        className={`map-view-control ${
          compact ? 'map-view-control-compact' : ''
        }`}
        role="group"
        aria-label={this.props.label || 'Map view'}
      >
        {mapViewOptions.map(option => {
          const active = SettingsStore.mapView === option.value;
          return (
            <button
              type="button"
              aria-pressed={active}
              className={`map-view-option ${active ? 'is-active' : ''}`}
              onClick={() => this.handleChange(option.value)}
              key={option.value}
            >
              <strong>{option.label}</strong>
              <small>{option.description}</small>
            </button>
          );
        })}
      </div>
    );
  }
}

export default MapViewControl;
