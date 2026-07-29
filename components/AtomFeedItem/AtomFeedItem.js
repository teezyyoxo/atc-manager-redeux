import { Component } from 'preact';
import './AtomFeedItem.css';

const relativeTime = value => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const diffSeconds = Math.round((date.getTime() - Date.now()) / 1000);
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
    ['second', 1]
  ];
  const unit = units.find(([, seconds]) => Math.abs(diffSeconds) >= seconds);
  if (
    unit &&
    typeof Intl !== 'undefined' &&
    typeof Intl.RelativeTimeFormat === 'function'
  ) {
    return new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' }).format(
      Math.round(diffSeconds / unit[1]),
      unit[0]
    );
  }
  return date.toLocaleDateString();
};

class AtomFeedItem extends Component {
  constructor(props) {
    super();
    this.state = {};
  }

  render() {
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        className="AtomFeedItem"
        href={this.props.link}
      >
        <figure style={{ backgroundImage: `url(${this.props.image})` }} />
        <h6>{this.props.title}</h6>
        <small>{relativeTime(this.props.time)}</small>
        <p>
          {this.props.content}
          <br />
        </p>
      </a>
    );
  }
}

export default AtomFeedItem;
