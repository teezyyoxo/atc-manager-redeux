import { Component } from 'preact';
import './SavedGamesOpen.css';
import { loadState, saveState } from '../../lib/persistance';
import { route } from 'preact-router';
import GameStore from '../../stores/GameStore';
import { sendMessageError } from '../GameMessages/GameMessages';
import { FaEdit, FaPlay, FaTrash } from 'react-icons/fa/index.esm';
import { SAVE_NAME_SEPARATOR } from '../../lib/game-save';
import { lpad } from '../../lib/util';

const formatSessionTime = value => {
  const seconds = Number.isFinite(Number(value)) ? Number(value) : 0;
  const hours = Math.floor(seconds / 3600) % 24;
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${lpad(String(hours), '0', 2)}:${lpad(String(minutes), '0', 2)}`;
};

const getSaveDetails = ({ name, state }) => {
  const session = state && typeof state === 'object' ? state : {};
  const separatorIndex = name.indexOf(SAVE_NAME_SEPARATOR);
  const possibleAirspace = separatorIndex > 0
    ? name.slice(0, separatorIndex).trim()
    : '';
  const storedAirspace = String(session.mapName || session.id || '').trim();
  const generatedName = separatorIndex > 0 && (
    !storedAirspace ||
    possibleAirspace.toLowerCase() === storedAirspace.toLowerCase()
  );
  const generatedAirspace = generatedName ? possibleAirspace : '';
  const savedLabel = generatedName
    ? name.slice(separatorIndex + SAVE_NAME_SEPARATOR.length).trim()
    : 'Named browser save';
  const airspace = String(
    storedAirspace || generatedAirspace || 'Session'
  ).toUpperCase();
  const title = generatedName ? generatedAirspace : name;
  const trafficCount = Array.isArray(session.traffic)
    ? session.traffic.length
    : 0;

  return {
    airspace,
    savedLabel,
    title,
    trafficLabel: `${trafficCount} active`,
    timeLabel: formatSessionTime(session.time)
  };
};

class SavedGamesOpen extends Component {
  constructor(props) {
    super();

    const games = [];
    const s = loadState();
    for (const name in s.games) {
      if (Object.prototype.hasOwnProperty.call(s.games, name)) {
        games.push({ name, state: s.games[name] });
      }
    }

    this.state = { games };
  }

  handleSavedGamesOpenListItemClick = name => {
    if (GameStore.started) {
      const force = confirm(
        'Another game is already playing. Make sure you have saved your progress. Do you want to continue?'
      );
      if (force) {
        GameStore.stop();
      } else {
        return;
      }
    }
    try {
      GameStore.startLocalstorage(name);
      route('/game');
    } catch (error) {
      sendMessageError(`Unable to load "${name}".`);
      console.warn('Saved game load failed.', error);
    }
  };

  handleSavedGameEdit = name => {
    route(`/editor/save-editor?save=${encodeURIComponent(name)}`);
  };

  handleSavedGameOpenListItemTrash = name => {
    const state = loadState();
    const sure = confirm(`Delete the saved session "${name}"?`);
    if (!sure) return;
    delete state.games[name];
    saveState(state);
    const games = [];
    for (const name in state.games) {
      if (Object.prototype.hasOwnProperty.call(state.games, name)) {
        games.push({ name, state: state.games[name] });
      }
    }
    this.setState({ games });
  };

  render() {
    const list = this.state.games.map((save, index) => {
      const details = getSaveDetails(save);
      const titleId = `saved-session-${index}`;
      return (
        <article
          data-name={save.name}
          key={save.name}
          className="save"
          aria-labelledby={titleId}
        >
          <div className="save-content">
            <header className="save-heading">
              <span className="save-airspace">{details.airspace} airspace</span>
              <strong id={titleId} className="save-name">
                {details.title}
              </strong>
            </header>
            <dl className="save-details">
              <div className="save-detail save-detail-saved">
                <dt>Saved</dt>
                <dd>{details.savedLabel}</dd>
              </div>
              <div className="save-detail">
                <dt>Sim time</dt>
                <dd>{details.timeLabel}</dd>
              </div>
              <div className="save-detail">
                <dt>Traffic</dt>
                <dd>{details.trafficLabel}</dd>
              </div>
            </dl>
          </div>
          <div
            className="save-actions"
            role="group"
            aria-label={`Actions for ${save.name}`}
          >
            <button
              type="button"
              className="save-action save-resume"
              onClick={() => this.handleSavedGamesOpenListItemClick(save.name)}
              aria-label={`Resume ${save.name}`}
              title="Resume session"
            >
              <FaPlay />
              <span className="visually-hidden">Resume</span>
            </button>
            <button
              type="button"
              className="save-action save-edit"
              onClick={() => this.handleSavedGameEdit(save.name)}
              aria-label={`Edit ${save.name}`}
              title="Edit save"
            >
              <FaEdit />
              <span className="visually-hidden">Edit</span>
            </button>
            <button
              type="button"
              className="save-action save-delete"
              onClick={() => this.handleSavedGameOpenListItemTrash(save.name)}
              aria-label={`Delete ${save.name}`}
              title="Delete save"
            >
              <FaTrash />
              <span className="visually-hidden">Delete</span>
            </button>
          </div>
        </article>
      );
    });
    return (
      <div className="savedgamesopen">
        <span className="savedgamesopen-label">Saves:</span>
        <div className="savedgamesopen-list">
          {list.length > 0 ? list : (
            <small className="savedgamesopen-empty">No saved sessions yet.</small>
          )}
        </div>
      </div>
    );
  }
}

export default SavedGamesOpen;
