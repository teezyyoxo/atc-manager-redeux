import { Component } from 'preact';
import './MSALayer.css';
import GameStore from '../../stores/GameStore';
import MSABlocks from '../MSABlocks/MSABlocks';

class MSALayer extends Component {
  render() {
    const msa = GameStore.map && GameStore.map.msa;
    if (!msa || !Array.isArray(msa.polygons)) return null;
    return (
      <g className="msa-layer">
        {msa.polygons.map((polygon, i) => (
          <MSABlocks
            zoom={GameStore.zoom}
            key={i}
            polygon={polygon.vertices}
            msa={polygon.alt}
          />
        ))}
      </g>
    );
  }
}

export default MSALayer;
