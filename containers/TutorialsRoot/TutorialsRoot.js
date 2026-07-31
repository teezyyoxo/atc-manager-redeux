import { Component } from 'preact';
import './TutorialsRoot.css';
import { FaInfo } from 'react-icons/fa/index.esm';
import { Link } from 'preact-router';
import WorkspaceShell from '../../components/WorkspaceShell/WorkspaceShell';

const TutorialCard = ({ href, title, description, disabled, duration, level }) => {
  const content = (
    <span className="tutorial-card">
      <span className="tutorial-card-icon"><FaInfo /></span>
      <span>
        <strong>{title}</strong>
        <small>{description}</small>
        <span className="tutorial-card-meta">{level} · {duration}</span>
      </span>
      <span className="tutorial-card-arrow" aria-hidden="true">
        {disabled ? 'Soon' : '→'}
      </span>
    </span>
  );

  return disabled ? (
    <span className="tutorial-card-link disabled" aria-disabled="true">
      {content}
    </span>
  ) : (
    <Link className="tutorial-card-link" href={href}>
      {content}
    </Link>
  );
};

class TutorialsRoot extends Component {
  render() {
    return (
      <WorkspaceShell
        className="training-hub-workspace"
        kicker="Training Library"
        title="Learn the Scope"
        description="Follow a structured path from first contact through compact command workflows and mixed traffic."
      >
        <div className="tutorial-hub">
          <div className="tutorial-path-heading">
            <span className="workspace-kicker">Recommended Path</span>
            <p>Start with Introduction, then use Text Commands when the visual controls feel familiar.</p>
          </div>
          <div className="tutorial-card-grid">
            <TutorialCard
              href="/tutorials/intro"
              title="Introduction"
              description="Radar basics, flight strips, commands, and landing."
              duration="12 min"
              level="Fundamentals"
            />
            <TutorialCard
              href="/tutorials/text-commands"
              title="Text Commands"
              description="Build and issue compact keyboard instructions."
              duration="8 min"
              level="Intermediate"
            />
            <TutorialCard
              title="General Aviation"
              description="Patterns, VFR routing, and mixed traffic."
              duration="Coming Soon"
              level="Intermediate"
              disabled
            />
            <TutorialCard
              title="Advanced Control"
              description="Sequencing, separation, and complex sessions."
              duration="Coming Soon"
              level="Advanced"
              disabled
            />
          </div>
        </div>
      </WorkspaceShell>
    );
  }
}

export default TutorialsRoot;
