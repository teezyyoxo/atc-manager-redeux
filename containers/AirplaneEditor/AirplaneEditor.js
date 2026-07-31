import { Component } from 'preact';
import './AirplaneEditor.css';
import { FaPaperPlane, FaSpinner } from 'react-icons/fa/index.esm';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { saveAs } from 'file-saver';
import { saveState, loadState } from '../../lib/persistance';
import {
  airplanesById,
  airplanes,
  refresh,
  defaultAirplanes
} from '../../lib/airplane-library/airplane-library';
import SchemaForm from 'react-jsonschema-form';
import {
  sendMessageInfo,
  sendMessageError,
  sendMessageWarning
} from '../../components/GameMessages/GameMessages';
import { clone } from 'jsondiffpatch';
import airplaneSchema from '../../schema/airplane-model';

class AirplaneEditor extends Component {
  constructor(props) {
    super();

    refresh();

    this.state = {
      json: '',
      plane: null,
      planesSet: Object.assign(
        {},
        ...(loadState().customAirplanes || []).map(x => ({ [x.id]: x }))
      ),
      debouncing: false,
      rawJSON: false
    };
  }

  handleInputChanged = e => {
    const id = e.target.value;
    const plane = airplanesById[id] || null;

    this.setState({
      plane,
      json: plane ? JSON.stringify(plane, null, 4) : ''
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
        prevstate.plane = obj;
        return prevstate;
      });
    } catch (err) {
      this.setState({
        warningMessage: err.message,
        infoMessage: null,
        plane: null
      });
    }
  }, 500);

  handleSaveClick = e => {
    if (this.state.plane === null)
      return sendMessageError('Please submit a valid save file');
    const planesSet = this.state.planesSet;
    planesSet[this.state.plane.id] = this.state.plane;
    let gamePersistance = loadState();
    gamePersistance.customAirplanes = Object.values(planesSet);
    saveState(gamePersistance);

    refresh();

    this.setState({
      planesSet
    });
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
      `Savefile ${this.state.plane.name.trim()}.json`
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
          json: reader.result
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
      prevstate.plane = e.formData;
      prevstate.planesSet[prevstate.plane.id] = e.formData;
      prevstate.json = JSON.stringify(e.formData, null, 4);
      return prevstate;
    });
  };

  handleNewPlaneClick = e => {
    const newId = Math.max(...airplanes.map(x => x.id)) + 1;
    const plane = clone(airplanes[0]);
    plane.id = newId;
    this.setState(prevstate => {
      prevstate.plane = plane;
      prevstate.planesSet[plane.id] = plane;
      prevstate.json = JSON.stringify(plane, null, 4);
      return prevstate;
    });
  };

  handlePlaneDeleteClick = e => {
    if (this.state.plane === null)
      return sendMessageWarning('No plane is selected');
    const planesSet = this.state.planesSet;
    delete planesSet[this.state.plane.id];
    let gamePersistance = loadState();
    gamePersistance.customAirplanes = Object.values(planesSet);
    saveState(gamePersistance);

    refresh();

    this.setState({
      planesSet,
      plane: null,
      json: ''
    });
    sendMessageInfo('Saved file to local storage');
  };

  render() {
    const url =
      typeof window !== 'undefined'
        ? window.location.origin
        : 'https://esstudio.site/atc-manager-2';

    return (
      <div className="AirplaneEditor">
        <div className="panel editor-surface">
          <div className="editor-toolbar">
            <label className="editor-picker">
              <span>Aircraft Profile</span>
              <select
                value={this.state.plane ? this.state.plane.id : ''}
                onInput={this.handleInputChanged}
              >
                <option value="">Select an Aircraft</option>
                {Object.keys(airplanesById).map(id => (
                  <option key={id} value={id}>{airplanesById[id].name}</option>
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
            <div className="editor-inline-actions">
              <button onClick={this.handleNewPlaneClick}>New Aircraft</button>
              {this.state.plane ? (
                <button onClick={this.handlePlaneDeleteClick}>
                  {defaultAirplanes.map(x => x.id).includes(this.state.plane.id)
                    ? 'Reset Profile'
                    : 'Remove Profile'}
                </button>
              ) : null}
            </div>
          </div>
          {!this.state.plane ? (
            <div className="editor-empty-state">
              <strong>No Aircraft Selected</strong>
              <p>Select a profile, create a new aircraft, or import JSON.</p>
            </div>
          ) : null}
          <textarea
            onInput={this.handleJsonTextareaInput}
            className={`edit-save-box line-nums ${this.state.rawJSON ||
              'hidden'}`}
            value={this.state.json}
          />
          {this.state.plane ? (
            <div className="editor-form-canvas">
              <SchemaForm
                formData={this.state.plane}
                onChange={this.handleEditingObjectChange}
                schema={airplaneSchema}
                className={`edit-save-box ${this.state.rawJSON && 'hidden'}`}
              />
            </div>
          ) : null}
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
              id="airplane-editor-file"
              className="inputfile"
              type="file"
              accept=".json"
            />
            <label for="airplane-editor-file">Import JSON</label>
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
              disabled={this.state.debouncing || this.state.plane === null}
              onClick={this.handleSaveClick}
            >
              {this.state.debouncing ? <FaSpinner className="spinner" /> : <FaPaperPlane />}{' '}
              Save to Browser
            </button>
          </div>
        </div>
        <div className="panel editor-submission-panel">
          <h3>Submit for Approval</h3>
          <p>Send the currently selected aircraft profile for review.</p>

          <form
            action="https://getsimpleform.com/messages?form_api_token=edde415b219f71f64840e6a3dbd3ff7d"
            method="post"
            redirect={url + '/editor/airplane-submission-success'}
          >
            <label for="aircraft-review-email">Email</label>
            <input id="aircraft-review-email" type="email" name="email" required />
            <input name="content_type" type="hidden" value="plane" />
            <input
              name="content"
              type="hidden"
              value={
                this.state.plane && JSON.stringify(this.state.plane, null, 4)
              }
            />
            <label for="aircraft-review-sources">Sources</label>
            <small>
              Links or text pointing to sources you have used to create or edit
              an airplane so we can verify the data.
            </small>
            <textarea id="aircraft-review-sources" name="message" required minLength="20" />
            <button
              disabled={this.state.debouncing || this.state.plane === null}
              type="submit"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default AirplaneEditor;

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
