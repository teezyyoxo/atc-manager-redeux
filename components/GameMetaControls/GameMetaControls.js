import { Component } from 'preact';
import './GameMetaControls.css';
import GameStore from '../../stores/GameStore';
import { saveState, loadState, decimalFormatter } from '../../lib/persistance';
import {
  FaPause,
  FaPlay,
  FaSave
} from 'react-icons/fa/index.esm';
import {
  sendMessageWarning,
  sendMessageInfo
} from '../GameMessages/GameMessages';

class GameMetaControls extends Component {
  handlePauseResumeButtonClick = () => {
    GameStore[GameStore.paused ? 'resume' : 'pause']();
  };

  handleSaveButtonClick = () => {
    const game = JSON.parse(
      JSON.stringify(GameStore.toJson(), decimalFormatter(2))
    );
    const state = loadState();
    let name = prompt(
      'Name of your save?',
      `${GameStore.mapName} - ${new Date().toLocaleDateString()}`
    );
    if (!name) return sendMessageWarning('Please give a valid name...');
    if (state.games[name]) {
      var result = confirm(
        'This save already exists. Do you want to overwrite it?'
      );
      if (result === false)
        return sendMessageWarning(`${name} was not saved...`);
    }
    state.games[name] = game;
    saveState(state);
    sendMessageInfo(`${name} was saved...`);
  };

  render() {
    const paused = GameStore.paused;
    return (
      <div className="gamemetacontrols">
        <button className="w-50" onClick={this.handlePauseResumeButtonClick}>
          {paused ? (
            <span>
              <FaPlay /> Resume
            </span>
          ) : (
            <span>
              <FaPause /> Pause
            </span>
          )}
        </button>
        <button className="w-50" onClick={this.handleSaveButtonClick}>
          <FaSave /> Save
        </button>
      </div>
    );
  }
}

export default GameMetaControls;
