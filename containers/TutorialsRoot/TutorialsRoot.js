import { Component } from 'preact';
import './TutorialsRoot.css';
import { FaInfo } from 'react-icons/fa/index.esm';
import { Link } from 'preact-router';
import ThemeControl from '../../components/ThemeControl/ThemeControl';

const TutorialCard = ({ href, title, description, disabled }) => {
  const content = (
    <span className="tutorial-card">
      <span className="tutorial-card-icon"><FaInfo /></span>
      <span>
        <strong>{title}</strong>
        <small>{description}</small>
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
      <div className="tutorial-hub">
        <header className="tutorial-hub-header">
          <Link href="/" className="tutorial-home-link">
            <span aria-hidden="true">←</span> ATC Manager
          </Link>
          <ThemeControl />
        </header>
        <div className="tutorial-hub-main">
          <span className="tutorial-hub-kicker">Training Library</span>
          <h1>Learn the scope.</h1>
          <p>
            Start with the essentials, then move into faster command workflows
            and specialized traffic.
          </p>
          <div className="tutorial-card-grid">
            <TutorialCard
              href="/tutorials/intro"
              title="Introduction"
              description="Radar basics, flight strips, commands, and landing."
            />
            <TutorialCard
              href="/tutorials/text-commands"
              title="Text Commands"
              description="Build and issue compact keyboard instructions."
            />
            <TutorialCard
              title="General Aviation"
              description="Patterns, VFR routing, and mixed traffic."
              disabled
            />
            <TutorialCard
              title="Advanced Control"
              description="Sequencing, separation, and complex sessions."
              disabled
            />
          </div>
        </div>
      </div>
    );
  }
}

export default TutorialsRoot;
