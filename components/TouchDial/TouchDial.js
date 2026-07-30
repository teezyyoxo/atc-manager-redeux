import { Component } from 'preact';

const SEGMENTS = {
  0: ['a', 'b', 'c', 'd', 'e', 'f'],
  1: ['b', 'c'],
  2: ['a', 'b', 'd', 'e', 'g'],
  3: ['a', 'b', 'c', 'd', 'g'],
  4: ['b', 'c', 'f', 'g'],
  5: ['a', 'c', 'd', 'f', 'g'],
  6: ['a', 'c', 'd', 'e', 'f', 'g'],
  7: ['a', 'b', 'c'],
  8: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
  9: ['a', 'b', 'c', 'd', 'f', 'g'],
  '-': ['g']
};

const segmentNames = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

const SevenSegmentDigit = ({ value }) => {
  const activeSegments = SEGMENTS[value] || [];
  return (
    <span className="seven-segment-digit" aria-hidden="true">
      {segmentNames.map(segment => (
        <span
          key={segment}
          className={`segment segment-${segment} ${
            activeSegments.includes(segment) ? 'segment-active' : ''
          }`}
        />
      ))}
    </span>
  );
};

export const SevenSegmentDisplay = ({ value, digits }) => {
  const formatted = (`000000${Math.round(value || 0)}`).slice(-digits);
  return (
    <span className="seven-segment-display" aria-label={formatted}>
      {formatted.split('').map((digit, index) => (
        <SevenSegmentDigit key={`${index}-${digit}`} value={digit} />
      ))}
    </span>
  );
};

class TouchDial extends Component {
  pointerId = null;
  previousAngle = null;
  accumulatedAngle = 0;

  getStepCount = () =>
    Math.floor((this.props.max - this.props.min) / this.props.step) + 1;

  adjust = deltaSteps => {
    const { min, max, step, value, wrap, onChange } = this.props;
    const current = Number.isFinite(value) ? value : min;
    let next = current + deltaSteps * step;

    if (wrap) {
      const stepCount = this.getStepCount();
      const currentIndex = Math.round((current - min) / step);
      const nextIndex =
        ((currentIndex + deltaSteps) % stepCount + stepCount) % stepCount;
      next = min + nextIndex * step;
    } else {
      next = Math.min(max, Math.max(min, next));
    }

    if (next !== current) onChange(next);
  };

  getPointerAngle = e => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - (bounds.left + bounds.width / 2);
    const y = e.clientY - (bounds.top + bounds.height / 2);
    return Math.atan2(y, x) * 180 / Math.PI;
  };

  handlePointerDown = e => {
    e.preventDefault();
    this.pointerId = e.pointerId;
    this.previousAngle = this.getPointerAngle(e);
    this.accumulatedAngle = 0;
    if (e.currentTarget.setPointerCapture) {
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  handlePointerMove = e => {
    if (e.pointerId !== this.pointerId || this.previousAngle === null) return;
    e.preventDefault();

    const angle = this.getPointerAngle(e);
    let delta = angle - this.previousAngle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    this.previousAngle = angle;
    this.accumulatedAngle += delta;

    const steps = Math.trunc(this.accumulatedAngle / 10);
    if (steps !== 0) {
      this.adjust(steps);
      this.accumulatedAngle -= steps * 10;
    }
  };

  handlePointerUp = e => {
    if (e.pointerId !== this.pointerId) return;
    this.pointerId = null;
    this.previousAngle = null;
    this.accumulatedAngle = 0;
  };

  handleKeyDown = e => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      this.adjust(-1);
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      this.adjust(1);
    }
  };

  render() {
    const { label, value, min, max, digits, color, unit } = this.props;
    const progress = max === min ? 0 : (value - min) / (max - min);
    const dialAngle = -135 + Math.min(1, Math.max(0, progress)) * 270;

    return (
      <div
        className="touch-dial-control"
        style={`--touch-control-color:${color};--dial-angle:${dialAngle}deg;`}
      >
        <span className="touch-dial-label">{label}</span>
        <div className="touch-dial-row">
          <button
            type="button"
            className="touch-dial-step"
            onClick={() => this.adjust(-1)}
            aria-label={`Decrease ${label}`}
          >
            −
          </button>
          <div
            className="touch-dial"
            role="slider"
            tabIndex="0"
            aria-label={label}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            onKeyDown={this.handleKeyDown}
            onPointerDown={this.handlePointerDown}
            onPointerMove={this.handlePointerMove}
            onPointerUp={this.handlePointerUp}
            onPointerCancel={this.handlePointerUp}
          >
            <span className="touch-dial-indicator" />
            <SevenSegmentDisplay value={value} digits={digits} />
            <span className="touch-dial-unit">{unit}</span>
          </div>
          <button
            type="button"
            className="touch-dial-step"
            onClick={() => this.adjust(1)}
            aria-label={`Increase ${label}`}
          >
            +
          </button>
        </div>
      </div>
    );
  }
}

export default TouchDial;
