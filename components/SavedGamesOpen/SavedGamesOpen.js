import { Component } from 'preact';
import './SavedGamesOpen.css';
import { loadState, saveState } from '../../lib/persistance';
import { route } from 'preact-router';
import GameStore from '../../stores/GameStore';
import { sendMessageError } from '../GameMessages/GameMessages';
import { FaEdit, FaPlay, FaTrash } from 'react-icons/fa/index.esm';

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

    this.state = { games, selectedName: null };
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

  handleSavedGameSelection = name => {
    this.setState(prevstate => ({
      selectedName: prevstate.selectedName === name ? null : name
    }));
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
    this.setState({ games, selectedName: null });
  };

  render() {
    const list = this.state.games.map((x, i) => (
      <div
        data-name={x.name}
        key={i}
        className={`save ${
          this.state.selectedName === x.name ? 'is-selected' : ''
        }`}
      >
        <button
          type="button"
          className="save-select"
          onClick={() => this.handleSavedGameSelection(x.name)}
          aria-expanded={this.state.selectedName === x.name}
        >
          <span className="save-name">{x.name}</span>
          <span className="save-select-hint">Select</span>
        </button>
        <div className="save-actions" aria-label={`Actions for ${x.name}`}>
          <button
            type="button"
            className="save-action save-resume"
            onClick={() => this.handleSavedGamesOpenListItemClick(x.name)}
          >
            <FaPlay /> <span>Resume</span>
          </button>
          <button
            type="button"
            className="save-action"
            onClick={() => this.handleSavedGameEdit(x.name)}
          >
            <FaEdit /> <span>Edit</span>
          </button>
          <button
            type="button"
            className="save-action save-delete"
            onClick={() => this.handleSavedGameOpenListItemTrash(x.name)}
          >
            <FaTrash /> <span>Delete</span>
          </button>
        </div>
      </div>
    ));
    return (
      <div className="savedgamesopen">
        <span className="savedgamesopen-label">Saves:</span>
        <div className="savedgamesopen-list">
          {list.length > 0 ? list : <small>No Saved Sessions</small>}
        </div>
      </div>
    );
  }
}

export default SavedGamesOpen;
