import { Component } from 'preact';
import './SavesEditor.css';
import { FaPaperPlane, FaSpinner } from 'react-icons/fa/index.esm';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { saveAs } from 'file-saver';
import { saveState, loadState } from '../../lib/persistance';
import SchemaForm from 'react-jsonschema-form';
import {
  sendMessageError,
  sendMessageInfo
} from '../../components/GameMessages/GameMessages';
import persistanceSchema from '../../schema/persistance';
const mapSaveSchema = persistanceSchema.definitions.mapSave;

class SavesEditor extends Component {
  constructor(props) {
    super();

    this.state = {
      json: '',
      saveName: '',
      saves: loadState().games,
      editingObj: null,
      debouncing: false,
      rawJSON: false
    };
  }

  handleInputChanged = e => {
    const saveName = e.target.value;
    const save = this.state.saves[saveName] || null;
    this.setState({
      saveName,
      json: save !== null ? JSON.stringify(save, null, 4) : '',
      editingObj: save
    });
  };

  handleJsonTextareaInput = e => {
    const json = e.target.value;
    this.setState({
      debouncing: true,
      json
    });
    this.parseTextareaJsonDebounced(json);
  };

  parseTextareaJsonDebounced = debounce(json => {
    this.setState({ debouncing: false });
    try {
      const obj = JSON.parse(json);
      this.setState(prevstate => {
        prevstate.warningMessage = null;
        prevstate.infoMessage = null;
        prevstate.editingObj = obj;
        return prevstate;
      });
    } catch (err) {
      this.setState({
        warningMessage: err.message,
        infoMessage: null,
        editingObj: null
      });
    }
  }, 500);

  handleSaveClick = e => {
    if (!this.state.saveName || this.state.editingObj === null)
      return sendMessageError('Please submit valid a valid save file');
    const saves = this.state.saves;
    saves[this.state.saveName] = this.state.editingObj;
    this.setState({
      saves
    });
    let gamePersistance = loadState();
    gamePersistance.games = saves;
    saveState(gamePersistance);
    sendMessageInfo('Saved file to local storage');
  };

  handleCopy = () => {
    this.setState({
      infoMessage: 'Savefile copied to clipboard.'
    });
  };

  handleSaveFileClick = () => {
    saveAs(
      new Blob([this.state.json], {
        type: 'application/json'
      }),
      `Savefile ${this.state.saveName.trim()}.json`
    );
  };

  readFromFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    const _this = this;
    reader.onload = function() {
      e.target.value = '';
      _this.setState(
        {
          debouncing: true,
          json: reader.result,
          saveName:
            _this.state.saveName || file.name.replace(/\.json$/i, '')
        },
        () => _this.parseTextareaJsonDebounced(reader.result)
      );
    };
    reader.readAsText(file);
  };

  handleRawJSONSwitchInput = e => {
    this.setState({
      rawJSON: e.target.checked
    });
  };

  handleEditingObjectChange = e => {
    this.setState(prevstate => {
      prevstate.editingObj = e.formData;
      prevstate.saves[prevstate.saveName] = e.formData;
      prevstate.json = JSON.stringify(e.formData, null, 4);
      return prevstate;
    });
  };

  render() {
    const save =
      (this.state.saveName && this.state.saves[this.state.saveName]) || null;
    return (
      <div className="SavesEditor">
        <div className="panel editor-surface">
          <div className="editor-toolbar">
            <label className="editor-picker">
              <span>Session</span>
              <select
                value={this.state.saveName}
                onInput={this.handleInputChanged}
              >
                <option value="">Select a Saved Session</option>
                {Object.keys(this.state.saves).map(key => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
            </label>
            <label className="editor-mode-control">
              <span>Raw JSON</span>
              <span className="switch">
                <input
                  type="checkbox"
                  onInput={this.handleRawJSONSwitchInput}
                  checked={this.state.rawJSON}
                />
                <span className="slider" />
              </span>
            </label>
          </div>
          {!save && !this.state.json ? (
            <div className="editor-empty-state">
              <strong>No Session Selected</strong>
              <p>Select a local save above or import a JSON file to begin.</p>
            </div>
          ) : null}
          {this.state.rawJSON ? (
            <textarea
              onInput={this.handleJsonTextareaInput}
              className="edit-save-box line-nums"
              value={this.state.json}
            />
          ) : null}
          {this.state.rawJSON || !this.state.editingObj ? null : (
            <div className="editor-form-canvas">
              <SchemaForm
                formData={this.state.editingObj}
                onChange={this.handleEditingObjectChange}
                schema={mapSaveSchema}
                className="edit-save-box"
              />
            </div>
          )}
          <div className="editor-feedback" aria-live="polite">
            {this.state.warningMessage ? (
              <span className="warning-message">{this.state.warningMessage}</span>
            ) : null}
            {this.state.infoMessage ? (
              <span className="info-message">{this.state.infoMessage}</span>
            ) : null}
          </div>
          <div className="editor-actions">
            <input
              onChange={this.readFromFile}
              id="saveseditor"
              className="inputfile"
              type="file"
              accept=".json"
            />
            <label for="saveseditor">Import JSON</label>
            <button
              onClick={this.handleSaveFileClick}
              disabled={this.state.debouncing || this.state.json === ''}
            >
              Export JSON
            </button>
            <CopyToClipboard text={this.state.json} onCopy={this.handleCopy}>
              <button disabled={this.state.debouncing || this.state.json === ''}>
                Copy JSON
              </button>
            </CopyToClipboard>
            <button
              className="editor-primary-action"
              disabled={this.state.debouncing || this.state.editingObj === null}
              onClick={this.handleSaveClick}
            >
              {this.state.debouncing ? <FaSpinner className="spinner" /> : <FaPaperPlane />}{' '}
              Save to Browser
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default SavesEditor;

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
