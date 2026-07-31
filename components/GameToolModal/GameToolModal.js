import { Component } from 'preact';
import './GameToolModal.css';

class GameToolModal extends Component {
  componentDidMount() {
    this.previousFocus = document.activeElement;
    this.lockBackground();
    document.addEventListener('keydown', this.handleKeyDown);
    if (this.closeButton) this.closeButton.focus();
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    this.unlockBackground();
    if (this.previousFocus && this.previousFocus.focus) {
      this.previousFocus.focus();
    }
  }

  lockBackground = () => {
    this.inertElements = [];
    let node = this.overlay;
    while (node && node.id !== 'atc-game') {
      const parent = node.parentElement;
      if (!parent) break;
      Array.from(parent.children).forEach(element => {
        if (element !== node && !element.hasAttribute('inert')) {
          element.setAttribute('inert', '');
          this.inertElements.push(element);
        }
      });
      node = parent;
    }
    document.documentElement.classList.add('game-tool-modal-open');
  };

  unlockBackground = () => {
    (this.inertElements || []).forEach(element => element.removeAttribute('inert'));
    this.inertElements = [];
    document.documentElement.classList.remove('game-tool-modal-open');
  };

  handleKeyDown = event => {
    if (event.key !== 'Tab' || !this.dialog) return;
    const controls = this.dialog.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), ' +
      'select:not([disabled]), textarea:not([disabled]), ' +
      '[tabindex]:not([tabindex="-1"])'
    );
    if (!controls.length) {
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

  render() {
    return (
      <div
        className="game-tool-modal-overlay"
        onClick={event => event.stopPropagation()}
        onPointerDown={event => event.stopPropagation()}
        ref={element => { this.overlay = element; }}
      >
        <section
          className={`game-tool-modal ${this.props.className || ''}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={this.props.titleId}
          ref={element => { this.dialog = element; }}
        >
          <header className="game-tool-modal-header">
            <div>
              {this.props.kicker ? (
                <span className="game-tool-modal-kicker">{this.props.kicker}</span>
              ) : null}
              <h2 id={this.props.titleId}>{this.props.title}</h2>
            </div>
            <button
              type="button"
              className="game-tool-modal-close"
              aria-label={`Close ${this.props.title}`}
              onClick={this.props.onClose}
              ref={element => { this.closeButton = element; }}
            >
              ×
            </button>
          </header>
          <div className="game-tool-modal-body">{this.props.children}</div>
        </section>
      </div>
    );
  }
}

export default GameToolModal;
