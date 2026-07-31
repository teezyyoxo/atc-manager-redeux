import { Component } from 'preact';
import './EditorsRoot.css';
import NotFound from '../NotFound/NotFound';
import AirplaneEditor from '../../containers/AirplaneEditor/AirplaneEditor';
import SavesEditor from '../../containers/SavesEditor/SavesEditor';
import OperatorEditor from '../../containers/OperatorEditor/OperatorEditor';
import AirplaneSubmissionSuccess from '../../containers/AirplaneSubmissionSuccess/AirplaneSubmissionSuccess';
import OperatorSubmissionSuccess from '../../containers/OperatorSubmissionSuccess/OperatorSubmissionSuccess';
import WorkspaceShell from '../../components/WorkspaceShell/WorkspaceShell';

const getEditorRoute = editorroute =>
  ({
    'airplane-editor': <AirplaneEditor />,
    'save-editor': <SavesEditor />,
    'operator-editor': <OperatorEditor />,
    'airplane-submission-success': <AirplaneSubmissionSuccess />,
    'operator-submission-success': <OperatorSubmissionSuccess />
  }[editorroute] || <NotFound />);

const editorDetails = {
  'save-editor': {
    title: 'Save editor',
    description: 'Inspect, repair, import, and export sessions stored in this browser.'
  },
  'airplane-editor': {
    title: 'Aircraft editor',
    description: 'Create and tune aircraft performance profiles for your local fleet.'
  },
  'operator-editor': {
    title: 'Operator editor',
    description: 'Manage airline identities, callsigns, colors, and fleet assignments.'
  },
  'airplane-submission-success': {
    title: 'Aircraft submitted',
    description: 'Your aircraft profile was sent for review.'
  },
  'operator-submission-success': {
    title: 'Operator submitted',
    description: 'Your operator profile was sent for review.'
  }
};

class EditorsRoot extends Component {
  constructor(props) {
    super();
    this.state = {};
  }

  render() {
    const details = editorDetails[this.props.editorroute] || {
      title: 'Tool unavailable',
      description: 'The requested editor could not be found.'
    };
    return (
      <WorkspaceShell
        className="editor-workspace"
        kicker="Local tools"
        title={details.title}
        description={details.description}
      >
        <div className="EditorsRoot">
          {getEditorRoute(this.props.editorroute)}
        </div>
      </WorkspaceShell>
    );
  }
}

export default EditorsRoot;
