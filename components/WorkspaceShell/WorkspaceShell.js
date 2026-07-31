import { Component } from 'preact';
import { Link } from 'preact-router';
import ThemeControl from '../ThemeControl/ThemeControl';
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
              <small>Control center</small>
            </span>
          </Link>
          <nav className="workspace-nav" aria-label="Workspace navigation">
            <Link href="/">Home</Link>
            <Link href="/tutorials">Training</Link>
            <Link href="/whats-new">What’s new</Link>
            <ThemeControl />
          </nav>
        </header>

        <div className="workspace-main">
          <section className="workspace-intro">
            <span className="workspace-kicker">{kicker}</span>
            <h1>{title}</h1>
            {description ? <p>{description}</p> : null}
          </section>
          <div className="workspace-content">{children}</div>
        </div>
      </div>
    );
  }
}

export default WorkspaceShell;
