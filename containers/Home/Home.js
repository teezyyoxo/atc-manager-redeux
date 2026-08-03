import { Component } from 'preact';
import './Home.css';
import {
  FaBuilding,
  FaClock,
  FaCog,
  FaExternalLinkAlt,
  FaGithub,
  FaInfo,
  FaPlane,
  FaPlay,
  FaSave,
  FaTools
} from 'react-icons/fa/index.esm';
import SavedGamesOpen from '../../components/SavedGamesOpen/SavedGamesOpen';
import { mapsArr, maps } from '../../lib/map';
import { Link, route } from 'preact-router';
import GameStore from '../../stores/GameStore';
import Settings from '../../components/Settings/Settings';
import { router } from '../../index';
import SettingsStore from '../../stores/SettingsStore';
import ThemeControl from '../../components/ThemeControl/ThemeControl';
import { getBuildInfo } from '../../lib/build-info';
import { openReleaseNotes } from '../../components/ReleaseNotesModal/ReleaseNotesModal';

// Homepage radar pacing lives here so the showcase can be tuned independently
// from the simulation clock.
export const HOME_RADAR_SCENARIO_MS = 60000;
export const HOME_RADAR_TRANSITION_MS = 2000;

const radarScenarios = [
  {
    airport: 'EHAM',
    facility: 'APP',
    aircraft: [
      { callsign: 'KLM641', type: 'B738', phase: 'arrival', altitude: [11000, 3000], speed: [280, 155] },
      { callsign: 'TRA8K', type: 'A21N', phase: 'departure', altitude: [1800, 14500], speed: [175, 315] },
      { callsign: 'DLH441', type: 'A320', phase: 'transit', altitude: [13000, 13000], speed: [330, 330] }
    ]
  },
  {
    airport: 'EGLL',
    facility: 'DIR',
    aircraft: [
      { callsign: 'BAW287', type: 'B789', phase: 'departure', altitude: [2400, 16000], speed: [185, 325] },
      { callsign: 'VIR12E', type: 'A35K', phase: 'arrival', altitude: [12000, 2800], speed: [290, 150] },
      { callsign: 'EZY54Q', type: 'A320', phase: 'arrival', altitude: [9000, 3200], speed: [260, 160] }
    ]
  },
  {
    airport: 'KLAX',
    facility: 'APP',
    aircraft: [
      { callsign: 'UAL1247', type: 'B739', phase: 'arrival', altitude: [10500, 2500], speed: [275, 150] },
      { callsign: 'AAL6', type: 'A321', phase: 'departure', altitude: [1700, 15000], speed: [170, 320] },
      { callsign: 'SKW5521', type: 'E75L', phase: 'arrival', altitude: [8000, 2200], speed: [245, 145] }
    ]
  },
  {
    airport: 'KPSP',
    facility: 'TRACON',
    aircraft: [
      { callsign: 'SWA2184', type: 'B38M', phase: 'departure', altitude: [2200, 13500], speed: [175, 305] },
      { callsign: 'ASA1186', type: 'B739', phase: 'arrival', altitude: [11500, 3400], speed: [285, 160] },
      { callsign: 'N731QS', type: 'C68A', phase: 'arrival', altitude: [7500, 3000], speed: [225, 135] }
    ]
  },
  {
    airport: 'EHZM',
    facility: 'APP',
    aircraft: [
      { callsign: 'N542AM', type: 'C172', phase: 'departure', altitude: [900, 6500], speed: [95, 125] },
      { callsign: 'DAL932', type: 'A20N', phase: 'arrival', altitude: [10000, 2600], speed: [270, 150] },
      { callsign: 'UAL532', type: 'E75L', phase: 'departure', altitude: [1600, 12500], speed: [165, 295] }
    ]
  }
];

const randomBetween = (min, max) => min + Math.random() * (max - min);
const clampRadarCoordinate = value => Math.max(5, Math.min(89, value));

const createFlightPath = phase => {
  const startAngle = randomBetween(0, Math.PI * 2);
  const curve = randomBetween(-.42, .42);
  const startRadius = phase === 'departure' ? randomBetween(.1, .16) : .46;
  const endRadius = phase === 'arrival' ? randomBetween(.1, .17) : .47;
  const transitTurn = phase === 'transit' ? randomBetween(2.6, 3.55) : curve;
  const points = [];

  for (let index = 0; index < 5; index++) {
    const progress = index / 4;
    const radius = startRadius + (endRadius - startRadius) * progress;
    const angle = startAngle +
      (phase === 'transit' ? transitTurn * progress : curve * progress);
    const wobble = index === 0 || index === 4 ? 0 : randomBetween(-2.8, 2.8);
    points.push({
      x: clampRadarCoordinate(50 + Math.cos(angle) * radius * 100 + wobble),
      y: clampRadarCoordinate(50 + Math.sin(angle) * radius * 100 - wobble)
    });
  }

  return points.reduce((style, point, index) => (
    `${style}--radar-x${index}:${point.x.toFixed(2)}%;` +
    `--radar-y${index}:${point.y.toFixed(2)}%;`
  ), `--radar-flight-duration:${HOME_RADAR_SCENARIO_MS}ms;`);
};

const createScenarioPaths = scenario =>
  scenario.aircraft.map(aircraft => createFlightPath(aircraft.phase));

const getRememberedScenario = () => {
  if (typeof window === 'undefined') return -1;
  try {
    const value = window.sessionStorage.getItem('atc-manager-home-radar');
    return value === null ? -1 : Number(value);
  } catch (error) {
    return -1;
  }
};

const rememberScenario = index => {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem('atc-manager-home-radar', index);
  } catch (error) {
    // The animation still works when browser storage is unavailable.
  }
};

const getInitialScenarioIndex = () => {
  const last = getRememberedScenario();
  const available = radarScenarios
    .map((scenario, index) => index)
    .filter(index => index !== last);
  const index = available[Math.floor(Math.random() * available.length)] || 0;
  rememberScenario(index);
  return index;
};

const interpolate = (range, progress, increment) =>
  Math.round((range[0] + (range[1] - range[0]) * progress) / increment) * increment;

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
    const radarScenarioIndex = getInitialScenarioIndex();
    this.state = {
      radarElapsed: 0,
      radarPaths: createScenarioPaths(radarScenarios[radarScenarioIndex]),
      radarScenarioIndex,
      radarTransition: false,
      sessionOpen: false,
      settingsOpen: false,
      toolsOpen: false
    };
    this.modalPreviousFocus = null;
    this.inertElements = [];
  }

  componentDidMount() {
    router.on('change', this.reRender);
    this.radarTicker = window.setInterval(this.updateRadarProgress, 1000);
    this.scheduleRadarScenario();
  }

  componentWillUnmount() {
    router.removeListener('change', this.reRender);
    this.finishModalClose();
    window.clearInterval(this.radarTicker);
    window.clearTimeout(this.radarScenarioTimer);
    window.clearTimeout(this.radarSwapTimer);
    window.clearTimeout(this.radarTransitionTimer);
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

  updateRadarProgress = () => {
    if (!this.state.radarTransition) {
      this.setState({ radarElapsed: Date.now() - this.radarScenarioStartedAt });
    }
  };

  scheduleRadarScenario = () => {
    this.radarScenarioStartedAt = Date.now();
    window.clearTimeout(this.radarScenarioTimer);
    this.radarScenarioTimer = window.setTimeout(
      this.beginRadarTransition,
      HOME_RADAR_SCENARIO_MS
    );
  };

  beginRadarTransition = () => {
    if (this.state.radarTransition) return;
    this.setState({ radarTransition: true });
    this.radarSwapTimer = window.setTimeout(() => {
      const choices = radarScenarios
        .map((scenario, index) => index)
        .filter(index => index !== this.state.radarScenarioIndex);
      const radarScenarioIndex =
        choices[Math.floor(Math.random() * choices.length)];
      const scenario = radarScenarios[radarScenarioIndex];
      rememberScenario(radarScenarioIndex);
      this.setState({
        radarElapsed: 0,
        radarPaths: createScenarioPaths(scenario),
        radarScenarioIndex
      });
    }, HOME_RADAR_TRANSITION_MS / 2);
    this.radarTransitionTimer = window.setTimeout(() => {
      this.setState({ radarTransition: false });
      this.scheduleRadarScenario();
    }, HOME_RADAR_TRANSITION_MS);
  };

  toggleTools = () => {
    this.setState({ toolsOpen: !this.state.toolsOpen });
  };

  openSession = () => {
    this.modalPreviousFocus = document.activeElement;
    document.documentElement.classList.add('home-session-open');
    document.addEventListener('keydown', this.handleSessionKeyDown);
    this.setState({ sessionOpen: true, settingsOpen: false, toolsOpen: false }, () => {
      this.lockModalBackground();
      if (this.sessionClose) this.sessionClose.focus();
    });
  };

  openSettings = () => {
    this.modalPreviousFocus = document.activeElement;
    document.documentElement.classList.add('home-session-open');
    document.addEventListener('keydown', this.handleSessionKeyDown);
    this.setState({ settingsOpen: true, sessionOpen: false, toolsOpen: false }, () => {
      this.lockModalBackground();
      if (this.settingsClose) this.settingsClose.focus();
    });
  };

  finishModalClose = () => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.remove('home-session-open');
    document.removeEventListener('keydown', this.handleSessionKeyDown);
    this.unlockModalBackground();
  };

  lockModalBackground = () => {
    if (typeof document === 'undefined') return;
    const root = document.querySelector('.home');
    if (!root) return;
    this.inertElements = Array.from(root.children).filter(
      element =>
        !element.classList.contains('home-session-overlay') &&
        !element.hasAttribute('inert')
    );
    this.inertElements.forEach(element => element.setAttribute('inert', ''));
  };

  unlockModalBackground = () => {
    this.inertElements.forEach(element => element.removeAttribute('inert'));
    this.inertElements = [];
  };

  closeSession = () => {
    this.finishModalClose();
    this.setState({ sessionOpen: false }, () => {
      if (
        this.modalPreviousFocus &&
        typeof this.modalPreviousFocus.focus === 'function'
      ) {
        this.modalPreviousFocus.focus();
      }
    });
  };

  closeSettings = () => {
    this.finishModalClose();
    this.setState({ settingsOpen: false }, () => {
      if (
        this.modalPreviousFocus &&
        typeof this.modalPreviousFocus.focus === 'function'
      ) {
        this.modalPreviousFocus.focus();
      }
    });
  };

  handleSessionKeyDown = event => {
    if (!this.state.sessionOpen && !this.state.settingsOpen) return;
    const dialog = this.state.settingsOpen
      ? this.settingsDialog
      : this.sessionDialog;
    if (event.key !== 'Tab' || !dialog) return;
    const controls = dialog.querySelectorAll(
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
    this.finishModalClose();
    GameStore.startMap(selectedMap.id);
    route('/game');
  };

  handleTutorialClick = () => {
    route('/tutorials/intro');
  };

  render() {
    const selectedMap = maps[SettingsStore.selectedMapId] || maps.default;
    const build = getBuildInfo();
    const radarScenario = radarScenarios[this.state.radarScenarioIndex];
    const radarProgress = Math.min(
      this.state.radarElapsed / HOME_RADAR_SCENARIO_MS,
      1
    );
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
                RETURN TO SESSION
              </button>
            ) : null}
            <Link href="/tutorials">TUTORIALS</Link>
            <button
              type="button"
              className="home-nav-link"
              onClick={openReleaseNotes}
            >
              WHAT’S NEW
            </button>
            <span className="home-nav-tools">
              <button
                type="button"
                className="home-nav-link"
                aria-expanded={this.state.toolsOpen}
                aria-haspopup="menu"
                onClick={this.toggleTools}
              >
                <FaTools /> TOOLS
              </button>
              {this.state.toolsOpen ? (
                <span className="home-tools-menu" role="menu">
                  <Link role="menuitem" href="/editor/save-editor">Save Editor</Link>
                  <Link role="menuitem" href="/editor/airplane-editor">Aircraft Editor</Link>
                  <Link role="menuitem" href="/editor/operator-editor">Operator Editor</Link>
                  <Link role="menuitem" href="/timelapse/overview">Timelapses</Link>
                </span>
              ) : null}
            </span>
            <button
              type="button"
              className="home-nav-link"
              onClick={this.openSettings}
            >
              <FaCog /> SETTINGS
            </button>
            <ThemeControl />
          </nav>
        </header>

        <div className="home-main">
          <section className="home-hero">
            <div className="home-hero-copy">
              <span className="home-eyebrow">Browser-Native ATC Simulation</span>
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
                  CONFIGURE SESSION
                </button>
                <button
                  type="button"
                  className="home-button home-button-secondary"
                  onClick={this.handleTutorialClick}
                >
                  VIEW TUTORIAL
                </button>
              </div>
              <div className="home-hero-meta" aria-label="Game capabilities">
                <span>IFR + VFR</span>
                <span>Local saves</span>
                <span>Touch ready</span>
              </div>
            </div>

            <div
              className={`home-radar-preview ${
                this.state.radarTransition ? 'is-transitioning' : ''
              }`}
              aria-label={`Live traffic preview for ${radarScenario.airport}`}
              style={`--radar-transition-duration:${HOME_RADAR_TRANSITION_MS}ms;`}
            >
              <div className="home-radar-grid" />
              <div className="home-radar-ring ring-one" />
              <div className="home-radar-ring ring-two" />
              <div className="home-radar-ring ring-three" />
              <div className="home-radar-sweep" />
              {radarScenario.aircraft.map((aircraft, index) => {
                const altitude = interpolate(
                  aircraft.altitude,
                  radarProgress,
                  100
                );
                const speed = interpolate(aircraft.speed, radarProgress, 5);
                const trend = aircraft.phase === 'arrival'
                  ? '↓'
                  : aircraft.phase === 'departure' ? '↑' : '→';
                return (
                  <div
                    className={`home-radar-aircraft is-${aircraft.phase}`}
                    key={`${radarScenario.airport}-${aircraft.callsign}`}
                    style={this.state.radarPaths[index]}
                  >
                    <span />
                    <strong>{aircraft.callsign} <em>{aircraft.type}</em></strong>
                    <small>{altitude}FT {trend} · {speed}KT</small>
                  </div>
                );
              })}
              <div className="home-radar-center">
                <span>{radarScenario.airport}</span>
                <small>{radarScenario.facility}</small>
              </div>
            </div>
          </section>

          <section className="home-card home-continue-section">
            <div className="home-section-heading">
              <div>
                <span className="home-kicker">Continue</span>
                <h2>Saved Sessions</h2>
              </div>
              <p>Resume a locally saved shift from this browser.</p>
            </div>
            <SavedGamesOpen />
          </section>

          <section id="tools" className="home-tools-section">
            <div className="home-section-heading">
              <div>
                <span className="home-kicker">Workspace</span>
                <h2>Tools and Training</h2>
              </div>
              <p>Everything stays local to this browser unless you export it.</p>
            </div>
            <div className="home-tools-grid">
              <ToolCard
                href="/editor/save-editor"
                icon={<FaSave />}
                title="Save Editor"
                description="Inspect and manage local sessions."
              />
              <ToolCard
                href="/editor/airplane-editor"
                icon={<FaPlane />}
                title="Aircraft Editor"
                description="Create and tune aircraft profiles."
              />
              <ToolCard
                href="/editor/operator-editor"
                icon={<FaBuilding />}
                title="Operator Editor"
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
            </div>
          </section>

        </div>

        <footer className="home-footer">
          <Link href="/" className="home-footer-brand">
            ATC Manager Redeux
          </Link>
          <div>
            <a
              href="https://github.com/teezyyoxo/atc-manager-redeux"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub /> GitHub <FaExternalLinkAlt />
            </a>
            <a
              href="https://www.reddit.com/r/ATCManager2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Reddit Community <FaExternalLinkAlt />
            </a>
            <a
              href="https://esstudio.site/contact"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact Studio <FaExternalLinkAlt />
            </a>
          </div>
        </footer>

        {this.state.settingsOpen ? (
          <div className="home-session-overlay">
            <section
              className="home-session-modal home-settings-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="home-settings-title"
              ref={element => {
                this.settingsDialog = element;
              }}
            >
              <header className="home-session-modal-header">
                <div>
                  <span className="home-kicker">Control Center</span>
                  <h2 id="home-settings-title">Settings</h2>
                </div>
                <button
                  type="button"
                  className="home-session-close"
                  aria-label="Close settings"
                  onClick={this.closeSettings}
                  ref={element => {
                    this.settingsClose = element;
                  }}
                >
                  ×
                </button>
              </header>
              <div className="home-session-modal-body">
                <Settings appearanceInitiallyExpanded />
              </div>
            </section>
          </div>
        ) : null}
        {this.state.sessionOpen ? (
          <div className="home-session-overlay">
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
                  <h2 id="home-session-title">Configure Session</h2>
                </div>
                <button
                  type="button"
                  className="home-session-close"
                  aria-label="Close session configuration"
                  onClick={this.closeSession}
                  ref={element => {
                    this.sessionClose = element;
                  }}
                >
                  ×
                </button>
              </header>
              <div className="home-session-modal-body">
                <div className="home-airport-field">
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
                        {map.name} [{map.airport.callsign.toUpperCase()}]
                      </option>
                    ))}
                  </select>
                  <div className="home-airport-notes">
                    {selectedMap.ga === 0 ? (
                      <small>
                        General aviation is unavailable at this airport.
                      </small>
                    ) : null}
                    {selectedMap.commercial === 0 ? (
                      <small>
                        Commercial traffic is unavailable at this airport.
                      </small>
                    ) : null}
                  </div>
                </div>
                <Settings />
              </div>
              <div className="home-start-actions">
                <button
                  type="button"
                  className="home-button home-button-primary home-start-button"
                  onClick={this.handleStartClick}
                >
                  <FaPlay /> Start Session
                </button>
                <button
                  type="button"
                  className="home-button home-button-secondary"
                  onClick={this.closeSession}
                >
                  Cancel
                </button>
              </div>
            </section>
          </div>
        ) : null}
      </div>
    );
  }
}

export default Home;
