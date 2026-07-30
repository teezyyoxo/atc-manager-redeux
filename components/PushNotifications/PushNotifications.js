import { Component } from 'preact';
import './PushNotifications.css';
import config from '../../lib/config';
import { sendMessageError } from '../GameMessages/GameMessages';

const urlBase64ToUint8Array = base64String => {
  if (typeof window === 'undefined') return;
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const status = {
  NOT_READY: 1,
  READY: 2,
  LOADING: 3,
  ERROR: 5,
  REGISTERED: 6,
  USER_REJECTED: 7
};

class PushNotifications extends Component {
  constructor(props) {
    super();
    this.state = {
      status: status.NOT_READY,
      cb: null
    };
  }

  componentDidMount() {
    this.mounted = true;
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      this.setState({ status: status.ERROR });
      return;
    }
    this.initialize();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  initialize = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (!this.mounted) return;
      if (subscription) {
        this.setState({ status: status.REGISTERED, subscription });
        return;
      }
      this.setState({
        status: status.READY,
        cb: () => this.subscribe(registration)
      });
    } catch (error) {
      this.handleError(error);
    }
  };

  subscribe = async registration => {
    this.setState({ status: status.LOADING });
    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(config.publicVapidKey)
      });
      const response = await fetch(config.subscriptionURL, {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: { 'content-type': 'application/json' }
      });
      if (!response.ok) {
        throw new Error(`Subscription request failed: ${response.status}`);
      }
      if (this.mounted) {
        this.setState({ status: status.REGISTERED, subscription });
      }
    } catch (error) {
      this.handleError(error);
    }
  };

  handleError = error => {
    if (!this.mounted) return;
    this.setState({ status: status.ERROR });
    sendMessageError('Whoops... Something went wrong.');
    console.warn('Push notification setup failed.', error);
  };

  unsubscribe = async () => {
    if (!this.state.subscription) return;
    try {
      const successful = await this.state.subscription.unsubscribe();
      if (successful && this.mounted) {
        this.setState({ status: status.USER_REJECTED });
      }
    } catch (error) {
      this.handleError(error);
    }
  };

  isVisible() {
    switch (this.state.status) {
    case status.READY:
    case status.REGISTERED:
    case status.ERROR:
    case status.USER_REJECTED:
    case status.LOADING:
      return true;
    case status.NOT_READY:
      return false;
    }
  }

  showButtons() {
    switch (this.state.status) {
    case status.READY:
    case status.LOADING:
      return true;
    case status.ERROR:
    case status.USER_REJECTED:
    case status.REGISTERED:
    case status.NOT_READY:
      return false;
    }
  }

  render() {
    const btnDisabled = this.state.status === status.LOADING;
    return (
      <div
        className={`PushNotifications ${this.isVisible() ? 'visible' : 'hidden'}`}
      >
        {this.showButtons() && (
          <div>
            Do you want to receive notifications from ATC Manager 3?
            <button
              onClick={() => this.setState({ status: status.USER_REJECTED })}
              disabled={btnDisabled}
            >
              No, Leave me alone *squawks 7600*
            </button>
            <button onClick={this.state.cb} disabled={btnDisabled}>
              Yes, acknowledge handover
            </button>
          </div>
        )}
        {this.state.status === status.REGISTERED && (
          <div>
            We can read you five by five. We'll keep you up to date.
            <button onClick={this.unsubscribe}>Terminate radio contact</button>
          </div>
        )}
        {this.state.status === status.ERROR && (
          <div>Whoops, something went wrong. *squawk 7700</div>
        )}
        {this.state.status === status.USER_REJECTED && (
          <div>Radio silence.</div>
        )}
      </div>
    );
  }
}

export default PushNotifications;
