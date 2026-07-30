import { Component } from 'preact';
import {
  getBuildInfo,
  getReleaseNotes,
  shouldAnnounceBuild
} from '../../lib/build-info';
import './ReleaseNotesModal.css';

const storageKey = 'atc-manager-3-last-seen-release-build';

const readLastSeenBuild = () => {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(storageKey);
  } catch (error) {
    console.warn('Unable to read the last viewed release build.', error);
    return null;
  }
};

const rememberBuild = label => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(storageKey, label);
  } catch (error) {
    console.warn('Unable to remember the last viewed release build.', error);
  }
};

class ReleaseNotesModal extends Component {
  constructor() {
    super();
    this.build = getBuildInfo();
    this.notes = getReleaseNotes();
    this.state = { open: false };
    this.previousFocus = null;
    this.inertElements = [];
  }

  componentDidMount() {
    if (!shouldAnnounceBuild(readLastSeenBuild(), this.build, this.notes)) {
      return;
    }

    this.previousFocus = document.activeElement;
    document.documentElement.classList.add('release-notes-open');
    document.addEventListener('keydown', this.handleKeyDown);
    this.setState({ open: true }, () => {
      this.lockBackground();
      if (this.closeIcon) this.closeIcon.focus();
    });
  }

  componentWillUnmount() {
    this.unlockBackground();
    document.documentElement.classList.remove('release-notes-open');
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  lockBackground = () => {
    this.inertElements = Array.from(
      document.querySelectorAll('main > :not(.release-notes-overlay)')
    ).filter(element => !element.hasAttribute('inert'));
    this.inertElements.forEach(element => element.setAttribute('inert', ''));
  };

  unlockBackground = () => {
    this.inertElements.forEach(element => element.removeAttribute('inert'));
    this.inertElements = [];
  };

  handleKeyDown = event => {
    if (!this.state.open) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      this.handleClose();
      return;
    }
    if (event.key !== 'Tab' || !this.dialog) return;

    const controls = this.dialog.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), ' +
      'select:not([disabled]), textarea:not([disabled]), ' +
      '[tabindex]:not([tabindex="-1"])'
    );
    if (controls.length === 0) {
      event.preventDefault();
      return;
    }
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  handleClose = () => {
    rememberBuild(this.build.label);
    this.unlockBackground();
    document.documentElement.classList.remove('release-notes-open');
    document.removeEventListener('keydown', this.handleKeyDown);
    this.setState({ open: false }, () => {
      if (
        this.previousFocus &&
        typeof this.previousFocus.focus === 'function'
      ) {
        this.previousFocus.focus();
      }
    });
  };

  preventBackgroundInteraction = event => {
    if (event.target === event.currentTarget) event.preventDefault();
  };

  render() {
    if (!this.state.open || !this.notes) return null;
    return (
      <div
        className="release-notes-overlay"
        onClick={this.preventBackgroundInteraction}
        onTouchMove={this.preventBackgroundInteraction}
      >
        <section
          className="release-notes-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="release-notes-title"
          aria-describedby="release-notes-build"
          ref={element => {
            this.dialog = element;
          }}
        >
          <header className="release-notes-header">
            <div>
              <span className="release-notes-kicker">New in this build</span>
              <h1 id="release-notes-title">What’s new</h1>
            </div>
            <button
              className="release-notes-close-icon"
              type="button"
              aria-label="Close new features"
              onClick={this.handleClose}
              ref={element => {
                this.closeIcon = element;
              }}
            >
              ×
            </button>
          </header>

          <div className="release-notes-version" id="release-notes-build">
            <span>Release {this.notes.version}</span>
            <code>{this.build.label}</code>
          </div>

          <div className="release-notes-content">
            {this.notes.sections.map(section => (
              <section
                className="release-notes-section"
                key={section.title}
              >
                <h2>{section.title}</h2>
                <ul>
                  {section.items.map((item, index) => (
                    <li key={`${section.title}-${index}`}>{item}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <button
            className="release-notes-close-bar"
            type="button"
            onClick={this.handleClose}
          >
            Close
          </button>
        </section>
      </div>
    );
  }
}

export default ReleaseNotesModal;
