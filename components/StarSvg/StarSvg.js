import { Component } from 'react';
import './StarSvg.css';
import GameStore from '../../stores/GameStore';
import config from '../../lib/config';
import SettingsStore from '../../stores/SettingsStore';

class StarSvg extends Component {
  zoomX = x => (x - config.width / 2) * GameStore.zoom + config.width / 2;

  zoomY = y => (y - config.height / 2) * GameStore.zoom + config.height / 2;

  labelPos = (p1, p2) => (p1 * 2 + p2) / 3;

  isFocussed = routeName =>
    this.props.cmd.tgt &&
    typeof this.props.cmd.tgt.tgtDirection === 'string' &&
    this.props.cmd.tgt.tgtDirection.toLowerCase() === routeName.toLowerCase();

  render() {
    if (!SettingsStore.sidsStars) return null;
    const stars = GameStore.parsedStars;
    if (!stars) return;
    const jsx = Object.keys(stars).map(key => {
      const star = stars[key].route
        .slice(0)
        .filter(x => typeof x.dir !== 'number');
      if (star.length < 2) return null;
      const mx = this.labelPos(
        GameStore.callsignsPos[star[0].dir].x,
        GameStore.callsignsPos[star[1].dir].x
      );
      const my = this.labelPos(
        GameStore.callsignsPos[star[0].dir].y,
        GameStore.callsignsPos[star[1].dir].y
      );
      let previous = star.splice(0, 1)[0];
      const starJsx = star.map((item, i) => {
        const attrs = {
          x1: this.zoomX(GameStore.callsignsPos[previous.dir].x),
          y1: this.zoomY(
            config.height - GameStore.callsignsPos[previous.dir].y
          ),
          x2: this.zoomX(GameStore.callsignsPos[item.dir].x),
          y2: this.zoomY(config.height - GameStore.callsignsPos[item.dir].y),
          key: i
        };

        previous = item;
        return <line {...attrs} />;
      });
      const classList = ['star'];
      if (this.isFocussed(key)) {
        classList.push('focussed');
      }
      return (
        <g key={key} className={classList.join(' ')}>
          <text x={this.zoomX(mx)} y={this.zoomY(config.height - my)}>
            {key}
          </text>
          {starJsx}
        </g>
      );
    });
    return <g className="StarSvg">{jsx}</g>;
  }
}

export default StarSvg;
