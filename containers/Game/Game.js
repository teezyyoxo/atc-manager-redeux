import { Component } from 'preact';
import './Game.css';
import AtcView from '../AtcView/AtcView';
import GameStore from '../../stores/GameStore';
import SettingsStore from '../../stores/SettingsStore';
import { maps } from '../../lib/map';
import { route } from 'preact-router';
import { saveCurrentGame } from '../../lib/game-save';

class Game extends Component {
  constructor(props) {
    super();
    this.state = {
      ready: GameStore.started,
      paused: GameStore.paused
    };
    this.pauseReason = null;
    this.name = maps[SettingsStore.selectedMapId]
      ? SettingsStore.selectedMapId
      : 'default';
  }

  componentDidMount() {
    document.documentElement.classList.add('game-session-open');
    document.body.classList.add('game-session-open');
    window.scrollTo(0, 0);
    GameStore.on('change', this.handleGameStoreChange);
    if (typeof document !== 'undefined') {
      document.addEventListener(
        'visibilitychange',
        this.handleVisibilityChange
      );
      document.addEventListener('freeze', this.handleLifecyclePause);
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('blur', this.handleWindowBlur);
      window.addEventListener('pagehide', this.handleLifecyclePause);
    }

    if (!GameStore.started) GameStore.startMap(this.name);
    this.setState({ ready: true, paused: GameStore.paused });
  }

  componentWillUnmount() {
    document.documentElement.classList.remove('game-session-open');
    document.body.classList.remove('game-session-open');
    GameStore.removeListener('change', this.handleGameStoreChange);
    if (typeof document !== 'undefined') {
      document.removeEventListener(
        'visibilitychange',
        this.handleVisibilityChange
      );
      document.removeEventListener('freeze', this.handleLifecyclePause);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('blur', this.handleWindowBlur);
      window.removeEventListener('pagehide', this.handleLifecyclePause);
    }
    this.pauseForInactivity();
  }

  handleGameStoreChange = () => {
    if (this.state.paused !== GameStore.paused) {
      this.setState({
        paused: GameStore.paused
      });
    }
  };

  handleVisibilityChange = () => {
    if (document.hidden) this.pauseForInactivity();
  };

  handleWindowBlur = () => {
    if (
      typeof document === 'undefined' ||
      document.hidden ||
      !document.hasFocus()
    ) {
      this.pauseForInactivity();
    }
  };

  handleLifecyclePause = () => {
    this.pauseForInactivity();
  };

  pauseForInactivity = () => {
    if (!GameStore.started || GameStore.paused) return;
    this.pauseReason =
      'The session was paused because this page became inactive.';
    GameStore.pause();
  };

  handleResume = () => {
    this.pauseReason = null;
    GameStore.resume();
  };

  exitSession = () => {
    GameStore.stop();
    route('/');
  };

  handleSaveAndExit = () => {
    if (saveCurrentGame()) this.exitSession();
  };

  handleExitWithoutSaving = () => {
    if (
      confirm(
        'Exit this session without saving? Any progress since your last save will be lost.'
      )
    ) {
      this.exitSession();
    }
  };

  render() {
    if (!this.state.ready) return <div className="loader mid" />;
    return (
      <div className="Game">
        <div id="atc-game">
          <AtcView />
        </div>
        {this.state.paused ? (
          <div className="game-pause-overlay">
            <div
              className="game-pause-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="game-pause-title"
            >
              <span className="game-pause-kicker">Simulation hold</span>
              <h1 id="game-pause-title">Session paused</h1>
              <p>
                {this.pauseReason ||
                  'Traffic and simulation time are safely stopped.'}
              </p>
              <div className="game-pause-actions">
                <button
                  className="game-pause-primary"
                  type="button"
                  onClick={this.handleResume}
                  autoFocus
                >
                  Resume session
                </button>
                <button type="button" onClick={this.handleSaveAndExit}>
                  Save &amp; exit
                </button>
                <button
                  className="game-pause-danger"
                  type="button"
                  onClick={this.handleExitWithoutSaving}
                >
                  Exit without saving
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default Game;
