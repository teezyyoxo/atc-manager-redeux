import { Component } from 'preact';
import { createPortal } from 'preact/compat';
import './GameToolModal.css';

class GameToolModal extends Component {
  componentDidMount() {
    this.previousFocus = document.activeElement;
    this.backgroundLocked = this.isModal();
    if (this.backgroundLocked) this.lockBackground();
    document.addEventListener('keydown', this.handleKeyDown);
    if (this.closeButton) this.closeButton.focus();
  }

  componentDidUpdate(prevProps) {
    const wasModal = prevProps.modal !== false;
    const isModal = this.isModal();
    if (wasModal === isModal) return;
    if (isModal) this.lockBackground();
    else this.unlockBackground();
    this.backgroundLocked = isModal;
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    if (this.backgroundLocked) this.unlockBackground();
    if (this.previousFocus && this.previousFocus.focus) {
      this.previousFocus.focus();
    }
  }

  isModal = () => this.props.modal !== false;

  lockBackground = () => {
    this.gameBackground = document.getElementById('atc-game');
    this.addedBackgroundInert = !!this.gameBackground &&
      !this.gameBackground.hasAttribute('inert');
    if (this.addedBackgroundInert) {
      this.gameBackground.setAttribute('inert', '');
    }
    document.documentElement.classList.add('game-tool-modal-open');
  };

  unlockBackground = () => {
    if (this.addedBackgroundInert && this.gameBackground) {
      this.gameBackground.removeAttribute('inert');
    }
    this.gameBackground = null;
    this.addedBackgroundInert = false;
    document.documentElement.classList.remove('game-tool-modal-open');
  };

  handleKeyDown = event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.props.onClose();
      return;
    }
    if (event.key !== 'Tab' || !this.dialog || !this.isModal()) return;
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
    const isModal = this.isModal();
    const modal = (
      <div
        className={`game-tool-modal-overlay ${
          this.props.overlayClassName || ''
        }`}
        onClick={event => event.stopPropagation()}
        onPointerDown={event => event.stopPropagation()}
        ref={element => { this.overlay = element; }}
      >
        <section
          className={`game-tool-modal ${this.props.className || ''}`}
          role="dialog"
          aria-modal={isModal ? 'true' : null}
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
    return typeof document === 'undefined'
      ? modal
      : createPortal(modal, document.body);
  }
}

export default GameToolModal;
