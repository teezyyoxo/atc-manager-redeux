import { Component } from 'preact';
import { Link } from 'preact-router';
import ThemeControl from '../ThemeControl/ThemeControl';
import { openReleaseNotes } from '../ReleaseNotesModal/ReleaseNotesModal';
import './WorkspaceShell.css';

class WorkspaceShell extends Component {
  render() {
    const {
      children,
      className = '',
      description,
      kicker,
      title
    } = this.props;

    return (
      <div className={`workspace-page ${className}`.trim()}>
        <header className="workspace-header">
          <Link href="/" className="workspace-brand">
            <span className="workspace-brand-mark">AM</span>
            <span>
              <strong>ATC Manager</strong>
              <small>Control Center</small>
            </span>
          </Link>
          <nav className="workspace-nav" aria-label="Workspace navigation">
            <Link href="/">Home</Link>
            <Link href="/tutorials">Training</Link>
            <button type="button" onClick={openReleaseNotes}>What’s New</button>
            <ThemeControl />
          </nav>
        </header>

        <div className="workspace-main">
          <section className="workspace-intro">
            <span className="workspace-kicker">{kicker}</span>
            <h1>{title}</h1>
            {description ? <p>{description}</p> : null}
          </section>
          <nav className="workspace-tool-switcher" aria-label="Tools and training">
            <Link href="/editor/save-editor">Saves</Link>
            <Link href="/editor/airplane-editor">Aircraft</Link>
            <Link href="/editor/operator-editor">Operators</Link>
            <Link href="/timelapse/overview">Timelapses</Link>
            <Link href="/tutorials">Tutorials</Link>
          </nav>
          <div className="workspace-content">{children}</div>
        </div>
      </div>
    );
  }
}

export default WorkspaceShell;
