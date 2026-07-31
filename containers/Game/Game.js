import { Component } from 'preact';
import './Game.css';
import AtcView from '../AtcView/AtcView';
import GameStore from '../../stores/GameStore';
import SettingsStore from '../../stores/SettingsStore';
import { maps } from '../../lib/map';
import { route } from 'preact-router';
import { saveCurrentGame, saveEvents } from '../../lib/game-save';

class Game extends Component {
  constructor(props) {
    super();
    this.state = {
      ready: GameStore.started,
      paused: GameStore.paused,
      pauseOverlaySuppressed: GameStore.pauseOverlaySuppressed
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
      document.addEventListener('keydown', this.handleModalKeyDown);
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('blur', this.handleWindowBlur);
      window.addEventListener('pagehide', this.handleLifecyclePause);
    }

    if (!GameStore.started) GameStore.startMap(this.name);
    this.setState({
      ready: true,
      paused: GameStore.paused,
      pauseOverlaySuppressed: GameStore.pauseOverlaySuppressed
    });
    this.autosaveElapsed = 0;
    this.autosaveLastTick = Date.now();
    this.autosaveTimer = window.setInterval(this.handleAutosaveTick, 1000);
    saveEvents.on('saved', this.handleSaveActivity);
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
      document.removeEventListener('keydown', this.handleModalKeyDown);
    }
    window.clearInterval(this.autosaveTimer);
    saveEvents.removeListener('saved', this.handleSaveActivity);
    if (typeof window !== 'undefined') {
      window.removeEventListener('blur', this.handleWindowBlur);
      window.removeEventListener('pagehide', this.handleLifecyclePause);
    }
    this.pauseForInactivity();
  }

  handleGameStoreChange = () => {
    if (
      this.state.paused !== GameStore.paused ||
      this.state.pauseOverlaySuppressed !== GameStore.pauseOverlaySuppressed
    ) {
      this.setState({
        paused: GameStore.paused,
        pauseOverlaySuppressed: GameStore.pauseOverlaySuppressed
      });
    }
  };

  handleSaveActivity = () => {
    this.autosaveElapsed = 0;
    this.autosaveLastTick = Date.now();
  };

  handleAutosaveTick = () => {
    const now = Date.now();
    const elapsed = now - this.autosaveLastTick;
    this.autosaveLastTick = now;
    if (!SettingsStore.autosaveEnabled) {
      this.autosaveElapsed = 0;
      return;
    }
    if (!GameStore.started || GameStore.paused) return;
    this.autosaveElapsed += elapsed;
    const interval = Math.max(
      1,
      Number(SettingsStore.autosaveIntervalMinutes) || 5
    ) * 60 * 1000;
    if (this.autosaveElapsed >= interval) {
      this.autosaveElapsed = 0;
      saveCurrentGame({ type: 'auto' });
    }
  };

  handleModalKeyDown = event => {
    const pauseModalVisible = this.state.paused &&
      !this.state.pauseOverlaySuppressed;
    if (!pauseModalVisible || event.key !== 'Tab' || !this.pauseDialog) return;
    const controls = this.pauseDialog.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), ' +
      'select:not([disabled]), textarea:not([disabled])'
    );
    if (!controls.length) return;
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
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
    const pauseModalVisible = this.state.paused &&
      !this.state.pauseOverlaySuppressed;
    const initialPause = GameStore.initialPause;
    return (
      <div className="Game">
        <div
          id="atc-game"
          inert={pauseModalVisible}
          aria-hidden={pauseModalVisible ? 'true' : null}
        >
          <AtcView />
        </div>
        {pauseModalVisible ? (
          <div className="game-pause-overlay">
            <div
              className="game-pause-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="game-pause-title"
              ref={element => { this.pauseDialog = element; }}
            >
              <span className="game-pause-kicker">
                {initialPause ? 'Ready Check' : 'Simulation Hold'}
              </span>
              <h1 id="game-pause-title">
                {initialPause ? 'Ready to Start' : 'Session Paused'}
              </h1>
              <p>
                {initialPause
                  ? 'Review the traffic picture, then start the session when you are ready.'
                  : this.pauseReason ||
                  'Traffic and simulation time are safely stopped.'}
              </p>
              <div className="game-pause-actions">
                <button
                  className="game-pause-primary"
                  type="button"
                  onClick={this.handleResume}
                  autoFocus
                >
                  {initialPause ? 'Start Session' : 'Resume Session'}
                </button>
                {!initialPause ? (
                  <button type="button" onClick={this.handleSaveAndExit}>
                    Save &amp; Exit
                  </button>
                ) : null}
                {!initialPause ? (
                  <button
                    className="game-pause-danger"
                    type="button"
                    onClick={this.handleExitWithoutSaving}
                  >
                    Exit Without Saving
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default Game;
