import { Component } from 'preact';
import './OperatorEditor.css';
import { FaPaperPlane, FaSpinner } from 'react-icons/fa/index.esm';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { saveAs } from 'file-saver';
import { saveState, loadState } from '../../lib/persistance';
import {
  refresh,
  operatorsById,
  defaultOperators,
  operators
} from '../../lib/airplane-library/airplane-library';
import SchemaForm from 'react-jsonschema-form';
import {
  sendMessageError,
  sendMessageInfo,
  sendMessageWarning
} from '../../components/GameMessages/GameMessages';
import { debounce } from '../../lib/util';
import { clone } from 'jsondiffpatch';
import operatorSchema from '../../schema/operator';

class OperatorEditor extends Component {
  constructor(props) {
    super();

    refresh();

    this.state = {
      json: '',
      operator: null,
      operatorsSet: Object.assign(
        {},
        ...(loadState().customOperators || []).map(x => ({ [x.id]: x }))
      ),
      debouncing: false,
      rawJSON: false
    };
  }

  handleInputChanged = e => {
    const id = e.target.value;
    const operator = operatorsById[id] || null;

    this.setState({
      operator,
      json: operator ? JSON.stringify(operator, null, 4) : ''
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
        prevstate.operator = obj;
        return prevstate;
      });
    } catch (err) {
      this.setState({
        warningMessage: err.message,
        infoMessage: null,
        operator: null
      });
    }
  }, 500);

  handleSaveClick = e => {
    if (this.state.operator === null)
      return sendMessageError('Please submit a valid save file');
    const operatorsSet = this.state.operatorsSet;
    operatorsSet[this.state.operator.id] = this.state.operator;
    let gamePersistance = loadState();
    gamePersistance.customOperators = Object.values(operatorsSet);
    saveState(gamePersistance);

    refresh();

    this.setState({
      operatorsSet
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
      `Savefile ${this.state.operator.name.trim()}.json`
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
      prevstate.operator = e.formData;
      prevstate.operatorsSet[prevstate.operator.id] = e.formData;
      prevstate.json = JSON.stringify(e.formData, null, 4);
      return prevstate;
    });
  };

  handleNewOperatorClick = e => {
    const newId = Math.max(...operators.map(x => x.id)) + 1;
    const operator = clone(operators[0]);
    operator.id = newId;
    this.setState(prevstate => {
      prevstate.operator = operator;
      prevstate.operatorsSet[operator.id] = operator;
      prevstate.json = JSON.stringify(operator, null, 4);
      return prevstate;
    });
  };

  handleOperatorDeleteClick = e => {
    if (this.state.operator === null)
      return sendMessageWarning('No operator is selected');
    const operatorsSet = this.state.operatorsSet;
    delete operatorsSet[this.state.operator.id];
    let gamePersistance = loadState();
    gamePersistance.customOperators = Object.values(operatorsSet);
    saveState(gamePersistance);

    refresh();

    this.setState({
      operatorsSet,
      operator: null,
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
      <div className="OperatorEditor">
        <div className="panel editor-surface">
          <div className="editor-toolbar">
            <label className="editor-picker">
              <span>Operator Profile</span>
              <select
                value={this.state.operator ? this.state.operator.id : ''}
                onInput={this.handleInputChanged}
              >
                <option value="">Select an Operator</option>
                {Object.keys(operatorsById).map(id => (
                  <option key={id} value={id}>{operatorsById[id].name}</option>
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
              <button onClick={this.handleNewOperatorClick}>New Operator</button>
              {this.state.operator ? (
                <button onClick={this.handleOperatorDeleteClick}>
                  {defaultOperators.map(x => x.id).includes(this.state.operator.id)
                    ? 'Reset Profile'
                    : 'Remove Profile'}
                </button>
              ) : null}
            </div>
          </div>
          {!this.state.operator ? (
            <div className="editor-empty-state">
              <strong>No Operator Selected</strong>
              <p>Select a profile, create a new operator, or import JSON.</p>
            </div>
          ) : null}
          <textarea
            onInput={this.handleJsonTextareaInput}
            className={`edit-save-box line-nums ${this.state.rawJSON ||
              'hidden'}`}
            value={this.state.json}
          />
          {this.state.operator ? (
            <div className="editor-form-canvas">
              <SchemaForm
                formData={this.state.operator}
                onChange={this.handleEditingObjectChange}
                schema={operatorSchema}
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
              id="operator-editor-file"
              className="inputfile"
              type="file"
              accept=".json"
            />
            <label for="operator-editor-file">Import JSON</label>
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
              disabled={this.state.debouncing || this.state.operator === null}
              onClick={this.handleSaveClick}
            >
              {this.state.debouncing ? <FaSpinner className="spinner" /> : <FaPaperPlane />}{' '}
              Save to Browser
            </button>
          </div>
        </div>
        <div className="panel editor-submission-panel">
          <h3>Submit for Approval</h3>
          <p>Send the currently selected operator profile for review.</p>

          <form
            action="https://getsimpleform.com/messages?form_api_token=edde415b219f71f64840e6a3dbd3ff7d"
            method="post"
            redirect={url + '/editor/operator-submission-success'}
          >
            <label for="operator-review-email">Email</label>
            <input id="operator-review-email" type="email" name="email" required />
            <input name="content_type" type="hidden" value="operator" />
            <input
              name="content"
              type="hidden"
              value={
                this.state.operator &&
                JSON.stringify(this.state.operator, null, 4)
              }
            />
            <label for="operator-review-sources">Sources</label>
            <small>
              Links or text pointing to sources you have used to create or edit
              an operator so we can verify the data.
            </small>
            <textarea id="operator-review-sources" name="message" required minLength="20" />
            <button
              disabled={this.state.debouncing || this.state.operator === null}
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

export default OperatorEditor;
