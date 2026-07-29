import { Component } from 'preact';
import './MSABlocks.css';
import { polyBounds, average } from '../../lib/util';

class MSABlocks extends Component {
  render() {
    const { zoom, polygon } = this.props;
    const bounds = polyBounds(polygon);
    const x = (average([bounds[1], bounds[3]]) - 640) * zoom + 640;
    const y = (average([bounds[0], bounds[2]]) - 360) * zoom + 360;
    const points = polygon
      .map(p => [p[0], 720 - p[1]].join(','))
      .join(' ');
    return (
      <g className="msa-polygon">
        <polygon
          points={points}
          transform={`translate(640 360) scale(${zoom}) translate(-640 -360)`}
        />
        <text x={x} y={720 - y}>
          {this.props.msa}
        </text>
      </g>
    );
  }
}

export default MSABlocks;
