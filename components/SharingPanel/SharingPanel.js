import { Component } from 'preact';
import { FaLink, FaShareAlt } from 'react-icons/fa/index.esm';
import './SharingPanel.css';
import {
  sendMessageError,
  sendMessageInfo
} from '../GameMessages/GameMessages';
import CopyToClipboard from 'react-copy-to-clipboard';
import SocialButtons from '../../components/SocialButtons/SocialButtons';

class SharingPanel extends Component {
  constructor(props) {
    super();
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    this.mounted = true;
    Promise.resolve(this.props.promise)
      .then(({ title, text, url }) => {
        if (this.mounted) {
          this.setState({ loading: false, title, text, url });
        }
      })
      .catch(error => {
        if (this.mounted) this.setState({ loading: false, error: true });
        console.warn('Unable to prepare sharing details.', error);
      });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  share = e => {
    if (!navigator.share) return;
    navigator
      .share({
        title: this.state.title,
        text: this.state.text,
        url: this.state.url
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          sendMessageError('Unable to share :(, sorry...');
        }
      });
  };

  handleCopy = () => {
    sendMessageInfo(`Copied ${this.state.url} to clipboard`);
  };

  handleTitleChange = e => {
    this.setState({
      title: e.target.value
    });
  };

  handleTextChange = e => {
    this.setState({
      text: e.target.value
    });
  };

  render() {
    const canShare =
      typeof window !== 'undefined' && window.navigator.share !== undefined;
    return (
      <div className={`sharing-panel ${this.state.loading ? 'loading' : ''}`}>
        <button onClick={this.props.onClose} class="close">
          &times;
        </button>
        {this.state.error ? (
          <div className="content">Unable to prepare sharing details.</div>
        ) : this.state.loading ? null : (
          <div class="content">
            <input
              type="text"
              spellcheck="false"
              onInput={this.handleTitleChange}
              value={this.state.title}
            />
            <br />
            <textarea
              spellcheck="false"
              onInput={this.handleTextChange}
              value={this.state.text}
            />
            <br />
            {canShare ? (
              <button class="button" onClick={this.share}>
                <FaShareAlt /> Share
              </button>
            ) : null}
            <CopyToClipboard text={this.state.url} onCopy={this.handleCopy}>
              <button title="Copy url to clipboard" class="button">
                <FaLink /> Copy Url
              </button>
            </CopyToClipboard>
            <SocialButtons
              url={this.state.url}
              text={this.state.title + '\n' + this.state.text}
            />
          </div>
        )}
      </div>
    );
  }
}

export default SharingPanel;
