import { Component } from 'preact';
import './TimelapseOverview.css';
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
        <div className="panel timelapse-library-panel">
          <div className="timelapse-library-header">
            <div>
              <span className="workspace-kicker">Recording Library</span>
              <h3>Saved Timelapses</h3>
              <p>Review local recordings or bring in an exported session.</p>
            </div>
            <div>
              <input
                id="timelapse-import"
                className="inputfile"
                type="file"
                accept=".json,.atc-timelapse.json"
                onChange={this.handleImport}
              />
              <label for="timelapse-import">Import Recording</label>
            </div>
          </div>
          <SavedTimelapseOpen key={this.state.revision} />
        </div>
      </div>
    );
  }
}

export default TimelapseOverview;
