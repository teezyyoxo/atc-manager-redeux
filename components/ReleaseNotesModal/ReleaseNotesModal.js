import { Component } from 'preact';
import { getBuildInfo, getReleaseNotes } from '../../lib/build-info';

const openEvent = 'atc-manager:open-release-notes';

export const openReleaseNotes = () => {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(openEvent));
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
    window.addEventListener(openEvent, this.handleOpen);
  }

  componentWillUnmount() {
    window.removeEventListener(openEvent, this.handleOpen);
    this.finishClose();
  }

  handleOpen = () => {
    if (!this.notes || this.state.open) return;
    this.previousFocus = document.activeElement;
    document.documentElement.classList.add('release-notes-open');
    document.addEventListener('keydown', this.handleKeyDown);
    this.setState({ open: true }, () => {
      this.lockBackground();
      if (this.closeIcon) this.closeIcon.focus();
    });
  };

  finishClose = () => {
    this.unlockBackground();
    document.documentElement.classList.remove('release-notes-open');
    document.removeEventListener('keydown', this.handleKeyDown);
  };

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
    this.finishClose();
    this.setState({ open: false }, () => {
      if (
        this.previousFocus &&
        typeof this.previousFocus.focus === 'function'
      ) {
        this.previousFocus.focus();
      }
    });
  };

  handleOverlayClick = event => {
    if (event.target === event.currentTarget) this.handleClose();
  };

  render() {
    if (!this.state.open || !this.notes) return null;
    return (
      <div
        className="release-notes-overlay"
        onClick={this.handleOverlayClick}
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
              <span className="release-notes-kicker">New in This Build</span>
              <h1 id="release-notes-title">What’s New</h1>
            </div>
            <button
              className="release-notes-close-icon"
              type="button"
              aria-label="Close What’s New"
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
            <a
              className="release-notes-changelog-link"
              href="https://github.com/teezyyoxo/atc-manager-redeux/blob/master/CHANGELOG.md"
              target="_blank"
              rel="noopener noreferrer"
            >
              Full Changelog <span aria-hidden="true">↗</span>
            </a>
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
