import { Component } from 'preact';
import './SavedTimelapseOpen.css';
import { loadState, saveState } from '../../lib/persistance';
import { route } from 'preact-router';
import { FaPlay, FaTrash } from 'react-icons/fa/index.esm';

class SavedTimelapseOpen extends Component {
  constructor(props) {
    super();

    const timelapses = [];
    const s = loadState();
    for (const name in s.timelapses) {
      if (Object.prototype.hasOwnProperty.call(s.timelapses, name)) {
        timelapses.push({ name, state: s.timelapses[name] });
      }
    }

    this.state = { timelapses };
  }

  handleSavedTimelapseOpenListItemClick = e => {
    const name = e.currentTarget.getAttribute('data-name');
    route('/timelapse/localstorage?key=' + name);
  };

  handleSavedTimelapseOpenListItemTrash = e => {
    const name = e.currentTarget.getAttribute('data-name');
    const state = loadState();
    const sure = confirm('Are you sure?');
    if (!sure) return;
    delete state.timelapses[name];
    saveState(state);
    const timelapses = [];
    for (const name in state.timelapses) {
      if (Object.prototype.hasOwnProperty.call(state.timelapses, name)) {
        timelapses.push({ name, state: state.timelapses[name] });
      }
    }
    this.setState({ timelapses });
  };

  render() {
    const list = this.state.timelapses.map(x => (
      <div key={x.name} className="timelapse-library-row">
        <span>
          <strong>{x.name}</strong>
          <small>Local browser recording</small>
        </span>
        <span className="timelapse-library-actions">
          <button
            type="button"
            onClick={this.handleSavedTimelapseOpenListItemClick}
            data-name={x.name}
          >
            <FaPlay /> Review
          </button>
          <button
            type="button"
            data-name={x.name}
            onClick={this.handleSavedTimelapseOpenListItemTrash}
            aria-label={`Delete ${x.name}`}
          >
            <FaTrash />
          </button>
        </span>
      </div>
    ));
    return (
      <div className="timelapse-library">
        <div className="timelapse-library-list">
          {list.length > 0 ? list : (
            <div className="editor-empty-state">
              <strong>No Recordings Yet</strong>
              <p>Import a recording, or start one manually during a session.</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default SavedTimelapseOpen;
