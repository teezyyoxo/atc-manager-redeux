import { Component } from 'preact';

const PULL_THRESHOLD = 68;
const MAX_PULL_DISTANCE = 112;
const PULL_RESISTANCE = .58;
const RELOAD_DELAY = 240;
const PULL_TO_REFRESH_MEDIA_QUERY =
  '(pointer: coarse) and (hover: none) and (max-width: 1366px)';
const IGNORED_TARGETS = [
  'a',
  'button',
  'input',
  'select',
  'textarea',
  '[contenteditable]',
  '[role="dialog"]',
  '[role="slider"]',
  '[data-pull-to-refresh-ignore]'
].join(',');

const isPullToRefreshSession = () => {
  if (typeof window === 'undefined') return false;
  if (typeof window.matchMedia === 'function') {
    return window.matchMedia(PULL_TO_REFRESH_MEDIA_QUERY).matches;
  }
  return false;
};

const isAtPageTop = target => {
  const scrollingElement = document.scrollingElement || document.documentElement;
  if (scrollingElement.scrollTop > 0) return false;

  let element = target instanceof Element ? target : null;
  while (element && element !== document.body) {
    const canScroll = element.scrollHeight > element.clientHeight;
    if (canScroll && element.scrollTop > 0) return false;
    element = element.parentElement;
  }

  return true;
};

const isEligibleTarget = target => {
  const element = target instanceof Element ? target : null;
  if (!element || element.closest(IGNORED_TARGETS)) return false;

  const gameOpen = document.documentElement.classList.contains(
    'game-session-open'
  );
  return !gameOpen || !!element.closest('.mobile-game-navbar');
};

class PullToRefresh extends Component {
  state = {
    armed: false,
    distance: 0,
    pulling: false,
    refreshing: false
  };

  startX = 0;
  startY = 0;
  startTarget = null;
  tracking = false;
  armed = false;

  componentDidMount() {
    if (!isPullToRefreshSession()) return;

    window.addEventListener('touchstart', this.handleTouchStart, {
      passive: true
    });
    window.addEventListener('touchmove', this.handleTouchMove, {
      passive: false
    });
    window.addEventListener('touchend', this.handleTouchEnd, {
      passive: true
    });
    window.addEventListener('touchcancel', this.handleTouchCancel, {
      passive: true
    });
  }

  componentWillUnmount() {
    window.removeEventListener('touchstart', this.handleTouchStart);
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchend', this.handleTouchEnd);
    window.removeEventListener('touchcancel', this.handleTouchCancel);
    window.clearTimeout(this.reloadTimer);
  }

  handleTouchStart = event => {
    if (
      this.state.refreshing ||
      event.touches.length !== 1 ||
      !isPullToRefreshSession() ||
      !isEligibleTarget(event.target) ||
      !isAtPageTop(event.target)
    ) {
      this.tracking = false;
      return;
    }

    const touch = event.touches[0];
    this.startX = touch.clientX;
    this.startY = touch.clientY;
    this.startTarget = event.target;
    this.tracking = true;
    this.armed = false;
  };

  handleTouchMove = event => {
    if (!this.tracking || event.touches.length !== 1) return;

    const touch = event.touches[0];
    const deltaX = touch.clientX - this.startX;
    const deltaY = touch.clientY - this.startY;

    if (deltaY <= 0 || Math.abs(deltaX) > deltaY) {
      this.cancelPull();
      return;
    }

    if (!isAtPageTop(this.startTarget)) {
      this.cancelPull();
      return;
    }

    if (event.cancelable) event.preventDefault();
    const distance = Math.min(
      MAX_PULL_DISTANCE,
      deltaY * PULL_RESISTANCE
    );
    this.armed = distance >= PULL_THRESHOLD;
    this.setState({
      armed: this.armed,
      distance,
      pulling: true
    });
  };

  handleTouchEnd = () => {
    if (!this.tracking) return;
    this.tracking = false;
    this.startTarget = null;

    if (!this.armed) {
      this.resetPull();
      return;
    }

    this.setState({
      armed: false,
      distance: PULL_THRESHOLD,
      pulling: false,
      refreshing: true
    });
    this.reloadTimer = window.setTimeout(() => {
      window.location.reload();
    }, RELOAD_DELAY);
  };

  handleTouchCancel = () => {
    if (this.tracking) this.cancelPull();
  };

  cancelPull = () => {
    this.tracking = false;
    this.startTarget = null;
    this.resetPull();
  };

  resetPull = () => {
    this.armed = false;
    this.setState({
      armed: false,
      distance: 0,
      pulling: false
    });
  };

  render() {
    if (!isPullToRefreshSession()) return null;

    const { armed, distance, pulling, refreshing } = this.state;
    const visible = pulling || refreshing;
    const label = refreshing
      ? 'Refreshing…'
      : armed
        ? 'Release to refresh'
        : 'Pull to refresh';
    const progress = Math.min(1, distance / PULL_THRESHOLD);

    return (
      <div
        className={`pull-to-refresh${visible ? ' is-visible' : ''}${
          armed ? ' is-armed' : ''
        }${refreshing ? ' is-refreshing' : ''}`}
        style={`--pull-distance:${distance}px;--pull-progress:${progress};`}
        aria-hidden={visible ? 'false' : 'true'}
        aria-live="polite"
      >
        <span className="pull-to-refresh-icon" aria-hidden="true">
          {refreshing ? '↻' : armed ? '↑' : '↓'}
        </span>
        <span className="pull-to-refresh-label">{label}</span>
      </div>
    );
  }
}

export default PullToRefresh;
