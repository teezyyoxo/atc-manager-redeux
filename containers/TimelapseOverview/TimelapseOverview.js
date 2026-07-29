import { Component } from 'preact';
import './TimelapseOverview.css';
import { route } from 'preact-router';
import SavedTimelapseOpen from '../../components/SavedTimelapseOpen/SavedTimelapseOpen';
import { loadState, saveState } from '../../lib/persistance';
import { parseTimelapse } from '../../lib/timelapse-file';
import {
  sendMessageError,
  sendMessageInfo
} from '../../components/GameMessages/GameMessages';

class TimelapseOverview extends Component {
  constructor(props) {
    super();
    this.state = { revision: 0 };
  }

  handleHomeCLick() {
    route('/');
  }

  handleImport = e => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const timelapse = parseTimelapse(reader.result);
        const suggestedName = file.name.replace(/\.atc-timelapse\.json$/i, '');
        const name = prompt('Name of imported timelapse?', suggestedName);
        if (!name) return;
        const state = loadState();
        if (
          state.timelapses[name] &&
          !confirm('A timelapse with this name exists. Overwrite it?')
        ) {
          return;
        }
        state.timelapses[name] = timelapse;
        saveState(state);
        this.setState({ revision: this.state.revision + 1 });
        sendMessageInfo(`${name} was imported.`);
      } catch (error) {
        sendMessageError('Unable to import that timelapse file.');
        console.warn('Timelapse import failed.', error);
      }
    };
    reader.readAsText(file);
  };

  render() {
    return (
      <div className="TimelapseOverview">
        <div className="abs-container">
          <button onClick={this.handleHomeCLick}>Home</button>
        </div>
        <div class="panel">
          <h3 className="text-center">Timelapse overview</h3>
        </div>
        <div className="panel">
          <input
            id="timelapse-import"
            className="inputfile"
            type="file"
            accept=".json,.atc-timelapse.json"
            onChange={this.handleImport}
          />
          <label for="timelapse-import">Import Timelapse</label>
          <SavedTimelapseOpen key={this.state.revision} />
        </div>
      </div>
    );
  }
}

export default TimelapseOverview;
