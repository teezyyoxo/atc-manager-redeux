import { Component } from 'preact';
import './GameMetaControls.css';
import GameStore from '../../stores/GameStore';
import { FaCheck, FaPause, FaSave } from 'react-icons/fa/index.esm';
import {
  createSessionSaveName,
  saveCurrentGame,
  saveEvents
} from '../../lib/game-save';
import GameToolModal from '../GameToolModal/GameToolModal';

class GameMetaControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feedback: '',
      saveAsOpen: false,
      saveAsName: '',
      shiftPressed: false
    };
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleModifierChange);
    window.addEventListener('keyup', this.handleModifierChange);
    window.addEventListener('blur', this.handleWindowBlur);
    saveEvents.on('saved', this.handleSaved);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleModifierChange);
    window.removeEventListener('keyup', this.handleModifierChange);
    window.removeEventListener('blur', this.handleWindowBlur);
    saveEvents.removeListener('saved', this.handleSaved);
    window.clearTimeout(this.feedbackTimer);
    if (this.resumeAfterSaveAs) GameStore.resume();
  }

  handleModifierChange = event => {
    if (this.state.saveAsOpen) return;
    const shiftPressed = !!event.shiftKey;
    if (shiftPressed !== this.state.shiftPressed) this.setState({ shiftPressed });
  };

  handleWindowBlur = () => {
    if (this.state.shiftPressed) this.setState({ shiftPressed: false });
  };

  handleSaved = ({ type }) => {
    window.clearTimeout(this.feedbackTimer);
    this.setState({ feedback: type === 'auto' ? 'Autosaved' : 'Saved!' });
    this.feedbackTimer = window.setTimeout(
      () => this.setState({ feedback: '' }),
      2600
    );
  };

  handlePauseResumeButtonClick = () => {
    GameStore[GameStore.paused ? 'resume' : 'pause']();
  };

  handleSaveButtonClick = event => {
    if (event.shiftKey || this.state.shiftPressed) {
      this.openSaveAs();
      return;
    }
    saveCurrentGame();
  };

  openSaveAs = () => {
    this.resumeAfterSaveAs = !GameStore.paused;
    if (this.resumeAfterSaveAs) GameStore.pause(true);
    this.setState({
      saveAsOpen: true,
      saveAsName: GameStore.saveName || createSessionSaveName(),
      shiftPressed: false
    });
  };

  closeSaveAs = () => {
    const shouldResume = this.resumeAfterSaveAs;
    this.resumeAfterSaveAs = false;
    this.setState({ saveAsOpen: false }, () => {
      if (shouldResume) GameStore.resume();
    });
  };

  handleSaveAsNameChange = event => {
    this.setState({ saveAsName: event.target.value });
  };

  handleSaveAsSubmit = event => {
    event.preventDefault();
    if (!this.state.saveAsName.trim()) return;
    if (saveCurrentGame({
      name: this.state.saveAsName.trim(),
      type: 'save-as',
      adoptName: false
    })) {
      this.closeSaveAs();
    }
  };

  render() {
    const saveLabel = this.state.feedback ||
      (this.state.shiftPressed ? 'Save As' : 'Save');
    return (
      <div className="gamemetacontrols">
        <button className="w-50" onClick={this.handlePauseResumeButtonClick}>
          <FaPause />
          <span className="game-meta-label">Pause</span>
          <span className="game-meta-separator" aria-hidden="true">/</span>
          <span className="game-meta-label">Exit</span>
        </button>
        <button
          className={`w-50 game-save-button ${this.state.feedback ? 'is-saved' : ''}`}
          onClick={this.handleSaveButtonClick}
          title="Hold Shift to Save As"
          aria-live="polite"
        >
          {this.state.feedback ? <FaCheck /> : <FaSave />}
          <span>{saveLabel}</span>
        </button>

        {this.state.saveAsOpen ? (
          <GameToolModal
            title="Save Session As"
            titleId="save-as-title"
            kicker="Local Save"
            onClose={this.closeSaveAs}
            className="save-as-modal"
          >
            <form className="save-as-form" onSubmit={this.handleSaveAsSubmit}>
              <label for="save-as-name">Save Name</label>
              <input
                id="save-as-name"
                type="text"
                value={this.state.saveAsName}
                onInput={this.handleSaveAsNameChange}
                autoFocus
              />
              <p>
                This creates a separate named save. Autosave continues updating
                its existing session save.
              </p>
              <div className="save-as-actions">
                <button type="button" onClick={this.closeSaveAs}>Cancel</button>
                <button
                  type="submit"
                  className="save-as-confirm"
                  disabled={!this.state.saveAsName.trim()}
                >
                  OK
                </button>
              </div>
            </form>
          </GameToolModal>
        ) : null}
      </div>
    );
  }
}

export default GameMetaControls;
