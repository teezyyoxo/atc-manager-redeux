import { Component } from 'preact';
import config from '../../lib/config';
import './GroundRunwaysSvg.css';
import GroundGameStore from '../../stores/GroundGameStore';
import { meterPerLatLng } from '../../lib/ground/navhelpers';

class GroundRunwaysSvg extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    GroundGameStore.on('change', this.handleGroundGameStoreChange);
    if (this.props.loaded) this.setGroundGameStoreData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.loaded && !prevProps.loaded) this.setGroundGameStoreData();
  }

  setGroundGameStoreData = () => {
    const { apt } = GroundGameStore;
    if (
      !this.props.loaded ||
      !apt ||
      !apt.taxiRoutingNetwork ||
      apt.taxiRoutingNetwork.nodes.length === 0
    ) {
      return;
    }

    const fieldMidLatLng = [GroundGameStore.aptNav.lat, GroundGameStore.aptNav.lng];
    const mpll = meterPerLatLng(fieldMidLatLng[0], fieldMidLatLng[1]);
    const fieldMid = [fieldMidLatLng[0] * mpll[0], fieldMidLatLng[1] * mpll[1]];
    const nodes = apt.taxiRoutingNetwork.nodes.map(node => ({
      identifier: node.identifier,
      lat: node.lat,
      lng: node.lng,
      x: mpll[1] * node.lng - fieldMid[1],
      y: mpll[0] * node.lat - fieldMid[0],
    }));
    const runwaysXY = apt.rwys.map(rwy => ({
      identifier: rwy.ends.map(end => end.identifier).join('-'),
      x1: mpll[1] * rwy.ends[0].lng - fieldMid[1],
      y1: mpll[0] * rwy.ends[0].lat - fieldMid[0],
      x2: mpll[1] * rwy.ends[1].lng - fieldMid[1],
      y2: mpll[0] * rwy.ends[1].lat - fieldMid[0]
    }));
    const midFromNodes = {
      minX: Math.min(...nodes.map(node => node.x)),
      maxX: Math.max(...nodes.map(node => node.x)),
      minY: Math.min(...nodes.map(node => node.y)),
      maxY: Math.max(...nodes.map(node => node.y))
    };
    const { minX, maxX, minY, maxY } = midFromNodes;
    const padding = config.groundPixelPadding;
    const width = maxX - minX;
    const height = maxY - minY;
    const maxRes = Math.max(width, height);
    const minWX = Math.min(config.width, config.height);
    this.getX = node => (node.x - minX) / maxRes * (minWX - padding * 2) + padding;
    this.getY = node => minWX - (node.y - minY) / maxRes * (minWX - padding * 2) - padding;
    const edges = apt.taxiRoutingNetwork.edges.map(edge => {
      return {
        identifier: edge.identifier,
        end: nodes.find(node => node.identifier === edge.end),
        start: nodes.find(node => node.identifier === edge.start),
        twoway: edge.twoway,
        runway: edge.runway,
      };
    }).filter(edge => edge.start && edge.end);
    edges.push(...apt.taxiRoutingNetwork.edges.filter(edge => edge.twoway).map(edge => {
      return {
        identifier: edge.identifier,
        start: nodes.find(node => node.identifier === edge.end),
        end: nodes.find(node => node.identifier === edge.start),
        twoway: edge.twoway,
        runway: edge.runway,
      };
    }).filter(edge => edge.start && edge.end));

    const distSq = (node1, node2) => Math.pow(Math.abs(node1.x - node2.x), 2) + Math.pow(Math.abs(node1.y - node2.y), 2);
    edges.forEach(edge => edge.cost = Math.sqrt(distSq(edge.start, edge.end)));
    edges.forEach(edge => edge.costSq = distSq(edge.start, edge.end));
    nodes.forEach(node => node.edges = edges.filter(x => x.start === node));
    this.setState({ runwaysXY, nodes, edges, midFromNodes });
  }

  componentWillUnmount() {
    GroundGameStore.removeListener('change', this.handleGroundGameStoreChange);
  }

  handleGroundGameStoreChange = () => {
    if (this.props.loaded) this.setGroundGameStoreData();
  }

  render() {
    if (!this.props.loaded || !this.state.nodes) return null;

    const { nodes, edges } = this.state;
    const { getX, getY } = this;

    const rwys = this.state.runwaysXY.map(({ identifier, x1, y1, x2, y2 }) => (
        <line
          key={identifier}
          x1={getX({ x: x1, y: y1 })}
          y1={getY({ x: x1, y: y1 })}
          x2={getX({ x: x2, y: y2 })}
          y2={getY({ x: x2, y: y2 })}
          stroke="#fff"
          strokeWidth="2"
        />
    ));

    const nodesJsx = nodes.map(node => (
      <circle className="ground-taxi-nodes" key={node.identifier} cx={getX(node)} cy={getY(node)} r="2" />
    ));

    const edgesJsx = edges.map((edge, i) => (
      <line className="ground-taxi-edges"
        key={`${edge.start.identifier}-${edge.end.identifier}-${i}`}
        x1={getX(edge.start)} y1={getY(edge.start)}
        x2={getX(edge.end)} y2={getY(edge.end)} />
    ));

    return <g className="GroundRunwaysSvg">{rwys}{nodesJsx}{edgesJsx}</g>;
  }
}

export default GroundRunwaysSvg;
