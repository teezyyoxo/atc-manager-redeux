import { Component } from 'preact';
import './GameMetaControls.css';
import GameStore from '../../stores/GameStore';
import {
  FaPause,
  FaSave
} from 'react-icons/fa/index.esm';
import { saveCurrentGame } from '../../lib/game-save';

class GameMetaControls extends Component {
  handlePauseResumeButtonClick = () => {
    GameStore[GameStore.paused ? 'resume' : 'pause']();
  };

  handleSaveButtonClick = () => saveCurrentGame();

  render() {
    return (
      <div className="gamemetacontrols">
        <button className="w-50" onClick={this.handlePauseResumeButtonClick}>
          <span>
            <FaPause /> Pause / exit
          </span>
        </button>
        <button className="w-50" onClick={this.handleSaveButtonClick}>
          <FaSave /> Save
        </button>
      </div>
    );
  }
}

export default GameMetaControls;
