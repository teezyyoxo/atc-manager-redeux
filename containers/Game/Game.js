import { Component } from 'preact';
import './Game.css';
import AtcView from '../AtcView/AtcView';
import GameStore from '../../stores/GameStore';
import SettingsStore from '../../stores/SettingsStore';
import { maps } from '../../lib/map';

class Game extends Component {
  constructor(props) {
    super();
    this.state = { ready: GameStore.started };
    this.name = maps[SettingsStore.selectedMapId]
      ? SettingsStore.selectedMapId
      : 'default';
  }

  componentDidMount() {
    if (!GameStore.started) GameStore.startMap(this.name);
    this.setState({ ready: true });
  }

  render() {
    if (!this.state.ready) return <div className="loader mid" />;
    return (
      <div className="Game">
        <div id="atc-game">
          <AtcView />
        </div>
      </div>
    );
  }
}

export default Game;
