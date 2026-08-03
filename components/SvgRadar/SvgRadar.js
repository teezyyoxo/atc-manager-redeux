import { Component } from 'preact';
import './SvgRadar.css';
import GameStore from '../../stores/GameStore';
import SettingsStore from '../../stores/SettingsStore';
import WayPoints from '../../components/WayPoints/WayPoints';
import Airport from '../../components/Airport/Airport';
import BackgroundSvg from '../../components/BackgroundSvg/BackgroundSvg';
import RadarTraffic from '../RadarTraffic/RadarTraffic';
import config from '../../lib/config';
import { getStyle } from '../../lib/svg';
import MSALayer from '../MSALayer/MSALayer';
import RouteVisualizer from '../RouteVisualizer/RouteVisualizer';
import SidSvg from '../SidSvg/SidSvg';
import StarSvg from '../StarSvg/StarSvg';
import GeographicMapLayer, {
  GeographicMapAttribution
} from '../GeographicMapLayer/GeographicMapLayer';

class SvgRadar extends Component {
  constructor(props) {
    super();
    this.state = {};
  }

  componentDidMount() {
    SettingsStore.on('change', this.reRender);
  }

  componentWillUnmount() {
    SettingsStore.removeListener('change', this.reRender);
  }

  reRender = () => {
    this.setState({});
  };

  setRef = el => GameStore.setSvgEl(el);

  render() {
    const airplanes = GameStore.traffic.map((airplane, i) => (
      <RadarTraffic
        key={airplane.regNum}
        index={i}
        airplane={airplane}
        cmd={this.props.cmd}
      />
    ));
    const transformScale =
      `translate(${config.width / 2} ${config.height / 2}) ` +
      `scale(${GameStore.zoom}) ` +
      `translate(-${config.width / 2} -${config.height / 2})`;
    const fontSize = SettingsStore.radarFontsize;
    const styles = getStyle(SettingsStore);

    return (
      <svg
        ref={this.setRef}
        onWheel={this.props.onZoom}
        onTouchStart={this.props.onTouchStart}
        onTouchMove={this.props.onTouchMove}
        onTouchEnd={this.props.onTouchEnd}
        onTouchCancel={this.props.onTouchEnd}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        className={`atc-view-svg map-view-${SettingsStore.mapView}`}
        width="100%"
        height="100%"
        onClick={this.props.onClick}
        viewBox="0 0 1280 720"
        preserveAspectRatio="xMidYMid meet"
        style={`background: ${
          SettingsStore.radarColor
        }; overflow: visible; font-size: ${fontSize}px;`}
      >
        <style>{styles}</style>
        <GeographicMapLayer />
        <g transform={transformScale}>
          <BackgroundSvg name={GameStore.id} />
        </g>
        <MSALayer />
        <SidSvg cmd={this.props.cmd} />
        <StarSvg cmd={this.props.cmd} />
        <WayPoints onContextMenu={this.props.onWayPointContextMenu} />
        <Airport />
        <RouteVisualizer cmd={this.props.cmd} />
        {airplanes}
        <rect
          width="100%"
          height="100%"
          fill="none"
          stroke="#fff"
          stroke-dasharray="20, 20"
          transform={transformScale}
        />
        <GeographicMapAttribution />
      </svg>
    );
  }
}

export default SvgRadar;
