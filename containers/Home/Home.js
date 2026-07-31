import { Component } from 'preact';
import './Home.css';
import {
  FaBuilding,
  FaClock,
  FaGithub,
  FaInfo,
  FaPlane,
  FaPlay,
  FaSave,
  FaShareAlt
} from 'react-icons/fa/index.esm';
import SavedGamesOpen from '../../components/SavedGamesOpen/SavedGamesOpen';
import { mapsArr, maps } from '../../lib/map';
import { Link, route } from 'preact-router';
import GameStore from '../../stores/GameStore';
import Settings from '../../components/Settings/Settings';
import { router } from '../../index';
import config from '../../lib/config';
import SharingPanel from '../../components/SharingPanel/SharingPanel';
import SettingsStore from '../../stores/SettingsStore';
import ThemeControl from '../../components/ThemeControl/ThemeControl';
import { getBuildInfo } from '../../lib/build-info';
import { openReleaseNotes } from '../../components/ReleaseNotesModal/ReleaseNotesModal';

const ToolCard = ({ href, icon, title, description }) => (
  <Link className="home-tool-card" href={href}>
    <span className="home-tool-icon">{icon}</span>
    <span className="home-tool-copy">
      <strong>{title}</strong>
      <small>{description}</small>
    </span>
    <span className="home-tool-arrow" aria-hidden="true">↗</span>
  </Link>
);

class Home extends Component {
  constructor(props) {
    super();
    this.state = {
      sharing: false,
      sessionOpen: false
    };
    this.sessionPreviousFocus = null;
  }

  componentDidMount() {
    router.on('change', this.reRender);
  }

  componentWillUnmount() {
    router.removeListener('change', this.reRender);
    this.finishSessionClose();
  }

  reRender = () => this.setState({});

  handleMapSelectionChange = e => {
    SettingsStore.selectedMapId = e.target.value;
    SettingsStore.emit('change');
    this.setState({});
  };

  handleReturnToGame = () => {
    route('/game');
  };

  sharingDone = () => this.setState({ sharing: false });

  share = () => this.setState({ sharing: true });

  scrollToSection = id => {
    const section = typeof document !== 'undefined'
      ? document.getElementById(id)
      : null;
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  openSession = () => {
    this.sessionPreviousFocus = document.activeElement;
    document.documentElement.classList.add('home-session-open');
    document.addEventListener('keydown', this.handleSessionKeyDown);
    this.setState({ sessionOpen: true }, () => {
      if (this.sessionSelect) this.sessionSelect.focus();
    });
  };

  finishSessionClose = () => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.remove('home-session-open');
    document.removeEventListener('keydown', this.handleSessionKeyDown);
  };

  closeSession = () => {
    this.finishSessionClose();
    this.setState({ sessionOpen: false }, () => {
      if (
        this.sessionPreviousFocus &&
        typeof this.sessionPreviousFocus.focus === 'function'
      ) {
        this.sessionPreviousFocus.focus();
      }
    });
  };

  handleSessionKeyDown = event => {
    if (!this.state.sessionOpen) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeSession();
      return;
    }
    if (event.key !== 'Tab' || !this.sessionDialog) return;
    const controls = this.sessionDialog.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), ' +
      'select:not([disabled]), [tabindex]:not([tabindex="-1"])'
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

  handleSessionOverlayClick = event => {
    if (event.target === event.currentTarget) this.closeSession();
  };

  handleStartClick = () => {
    if (GameStore.started) {
      const force = confirm(
        'Another game is already in progress. Make sure you have saved your progress. Do you want to continue?'
      );
      if (force) {
        GameStore.stop();
      } else {
        return;
      }
    }
    const selectedMap = maps[SettingsStore.selectedMapId] || maps.default;
    SettingsStore.selectedMapId = selectedMap.id;
    this.finishSessionClose();
    GameStore.startMap(selectedMap.id);
    route('/game');
  };

  handleTutorialClick = () => {
    route('/tutorials/intro');
  };

  render() {
    const selectedMap = maps[SettingsStore.selectedMapId] || maps.default;
    const build = getBuildInfo();
    return (
      <div className="home">
        <header className="home-header">
          <Link href="/" className="home-brand" aria-label="ATC Manager home">
            <span className="home-brand-mark">AM</span>
            <span>
              <strong>ATC Manager</strong>
              <small>Redeux · {build.label}</small>
            </span>
          </Link>
          <nav className="home-nav" aria-label="Primary navigation">
            {GameStore.started ? (
              <button
                type="button"
                className="home-nav-session"
                onClick={this.handleReturnToGame}
              >
                Return to session
              </button>
            ) : null}
            <Link href="/tutorials">Tutorials</Link>
            <button
              type="button"
              className="home-nav-link"
              onClick={openReleaseNotes}
            >
              What’s new
            </button>
            <button
              type="button"
              className="home-nav-link"
              onClick={() => this.scrollToSection('tools')}
            >
              Tools
            </button>
            <ThemeControl />
          </nav>
        </header>

        <div className="home-main">
          <section className="home-hero">
            <div className="home-hero-copy">
              <span className="home-eyebrow">Browser-native ATC simulation</span>
              <h1>Own the airspace.</h1>
              <p>
                Direct arrivals, sequence departures, and keep the picture
                moving across a live, responsive radar environment.
              </p>
              <div className="home-hero-actions">
                <button
                  type="button"
                  className="home-button home-button-primary"
                  onClick={this.openSession}
                >
                  Configure session
                </button>
                <button
                  type="button"
                  className="home-button home-button-secondary"
                  onClick={this.handleTutorialClick}
                >
                  View tutorial
                </button>
              </div>
              <div className="home-hero-meta" aria-label="Game capabilities">
                <span>IFR + VFR</span>
                <span>Local saves</span>
                <span>Touch ready</span>
              </div>
            </div>

            <div className="home-radar-preview" aria-hidden="true">
              <div className="home-radar-grid" />
              <div className="home-radar-ring ring-one" />
              <div className="home-radar-ring ring-two" />
              <div className="home-radar-ring ring-three" />
              <div className="home-radar-sweep" />
              <div className="home-radar-aircraft aircraft-one">
                <span />
                <strong>AAL1634</strong>
                <small>11000FT · 300KT</small>
              </div>
              <div className="home-radar-aircraft aircraft-two">
                <span />
                <strong>CCA136</strong>
                <small>12000FT · 320KT</small>
              </div>
              <div className="home-radar-aircraft aircraft-three">
                <span />
                <strong>DLH583</strong>
                <small>13000FT · 330KT</small>
              </div>
              <div className="home-radar-center">
                <span>EHAM</span>
                <small>APP</small>
              </div>
            </div>
          </section>

          <section className="home-card home-continue-section">
            <div className="home-section-heading">
              <div>
                <span className="home-kicker">Continue</span>
                <h2>Saved sessions</h2>
              </div>
              <p>Resume a locally saved shift from this browser.</p>
            </div>
            <SavedGamesOpen />
          </section>

          <section id="tools" className="home-tools-section">
            <div className="home-section-heading">
              <div>
                <span className="home-kicker">Workspace</span>
                <h2>Tools and training</h2>
              </div>
              <p>Everything stays local to this browser unless you export it.</p>
            </div>
            <div className="home-tools-grid">
              <ToolCard
                href="/editor/save-editor"
                icon={<FaSave />}
                title="Save editor"
                description="Inspect and manage local sessions."
              />
              <ToolCard
                href="/editor/airplane-editor"
                icon={<FaPlane />}
                title="Aircraft editor"
                description="Create and tune aircraft profiles."
              />
              <ToolCard
                href="/editor/operator-editor"
                icon={<FaBuilding />}
                title="Operator editor"
                description="Manage fleets, colors, and callsigns."
              />
              <ToolCard
                href="/timelapse/overview"
                icon={<FaClock />}
                title="Timelapses"
                description="Optional recordings you start manually in a session."
              />
              <ToolCard
                href="/tutorials"
                icon={<FaInfo />}
                title="Tutorials"
                description="Learn the scope and command workflow."
              />
              <button
                type="button"
                className="home-tool-card"
                onClick={this.share}
              >
                <span className="home-tool-icon"><FaShareAlt /></span>
                <span className="home-tool-copy">
                  <strong>Share</strong>
                  <small>Send ATC Manager to another device.</small>
                </span>
                <span className="home-tool-arrow" aria-hidden="true">↗</span>
              </button>
            </div>
          </section>

        </div>

        <footer className="home-footer">
          <span>ATC Manager Redeux · Built for focused sessions.</span>
          <div>
            <a
              href="https://github.com/teezyyoxo/atc-manager-redeux"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub /> GitHub
            </a>
            <a
              href="https://www.reddit.com/r/ATCManager2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Community
            </a>
            <a
              href="https://esstudio.site/contact"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact
            </a>
          </div>
        </footer>

        {this.state.sharing ? <div className="panel-open-bg" /> : null}
        {this.state.sharing ? (
          <SharingPanel
            onClose={this.sharingDone}
            promise={Promise.resolve({
              title: 'ATC Manager 3',
              text: config.description,
              url: config.url
            })}
          />
        ) : null}
        {this.state.sessionOpen ? (
          <div
            className="home-session-overlay"
            onClick={this.handleSessionOverlayClick}
          >
            <section
              className="home-session-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="home-session-title"
              ref={element => {
                this.sessionDialog = element;
              }}
            >
              <header className="home-session-modal-header">
                <div>
                  <span className="home-kicker">New shift</span>
                  <h2 id="home-session-title">Configure session</h2>
                </div>
                <button
                  type="button"
                  className="home-session-close"
                  aria-label="Close session configuration"
                  onClick={this.closeSession}
                >
                  ×
                </button>
              </header>
              <div className="home-session-modal-body">
                <label className="home-field-label" for="home-airport">
                  Airport
                </label>
                <select
                  id="home-airport"
                  value={selectedMap.id}
                  onInput={this.handleMapSelectionChange}
                  ref={element => {
                    this.sessionSelect = element;
                  }}
                >
                  {mapsArr.map(map => (
                    <option key={map.id} value={map.id}>
                      {map.name}
                    </option>
                  ))}
                </select>
                <div className="home-airport-notes">
                  {selectedMap.ga === 0 ? (
                    <small>General aviation is unavailable at this airport.</small>
                  ) : null}
                  {selectedMap.commercial === 0 ? (
                    <small>Commercial traffic is unavailable at this airport.</small>
                  ) : null}
                </div>
                <Settings />
                <div className="home-start-actions">
                  <button
                    type="button"
                    className="home-button home-button-primary home-start-button"
                    onClick={this.handleStartClick}
                  >
                    <FaPlay /> Start session
                  </button>
                  <button
                    type="button"
                    className="home-button home-button-secondary"
                    onClick={this.closeSession}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </section>
          </div>
        ) : null}
      </div>
    );
  }
}

export default Home;
