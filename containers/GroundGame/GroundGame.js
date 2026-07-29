import { Component } from 'preact';
import './GroundGame.css';
import GroundAptView from '../GroundAptView/GroundAptView';
import GroundGameStore from '../../stores/GroundGameStore';
import { meterPerLatLng } from '../../lib/ground/navhelpers';

class GroundGame extends Component {
  constructor(props) {
    super();
    this.state = {
      loaded: false,
    };

  }

  componentDidMount() {
    this.getAptByIcao('KBFI');
  }

  getAptByIcao = async icao => {
    try {
      this.setState({ loaded: false, error: null });
      this.latLngToXY = null;
      await GroundGameStore.loadByIcao(icao);
      const { apt, aptNav } = GroundGameStore;
      const [meterPerLat, meterPerLng] = meterPerLatLng(aptNav.lat, aptNav.lng);

      this.latLngToXY = (lat, lng) => ([
        (lat - aptNav.lat) * meterPerLat,
        (lng - aptNav.lng) * meterPerLng
      ]);
      this.setState({ apt, aptNav, loaded: true });
    } catch (error) {
      this.setState({ error: error.message || 'Unable to load airport data.' });
    }
  }

  render() {
    if (this.state.error) {
      return <div className="GroundGame error">{this.state.error}</div>;
    }

    return (
      <div className="GroundGame">
        <GroundAptView loaded={this.state.loaded} latLngToXY={this.latLngToXY} />
      </div>
    );
  }
}

export default GroundGame;
