import { Component } from 'preact';
import './LogsPanel.css';
import GameStore from '../../stores/GameStore';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import GameToolModal from '../../components/GameToolModal/GameToolModal';
import { isMobileSession } from '../../lib/mobile';

class LogsPanel extends Component {
  constructor(props) {
    super();
    this.state = {
      logsOnlySelf: false
    };
  }

  handleOnlySelfButton = () => {
    this.setState({ logsOnlySelf: !this.state.logsOnlySelf });
  };

  handleLogsCopied = () => {
    this.setState({ logsCopied: true });
  };

  render() {
    if (!this.props.expanded) return null;
    const mobileSession = isMobileSession();
    const logs = this.state.logsOnlySelf ? GameStore.selfLog : GameStore.log;
    return (
      <GameToolModal
        title="Session Logs"
        titleId="game-logs-title"
        kicker="Traffic History"
        onClose={this.props.onToggle}
        className="game-logs-modal"
        overlayClassName="game-logs-modal-overlay"
        modal={mobileSession}
      >
        <div className="session-log-content">
          <div>Departures: {GameStore.departures}</div>
          <div>Arrivals: {GameStore.arrivals}</div>
          <div>Separation violations: {GameStore.distanceVialations}</div>
          <div>Unpermitted departures: {GameStore.unpermittedDepartures}</div>

          <div className="logs-container">
            <div className="logs-inner">
              {logs.slice(logs.length - 10, logs.length).map((x, i) => (
                <div key={i}>{x}</div>
              ))}
            </div>
          </div>
          <div aria-live="polite">
            {this.state.logsCopied ? 'Copied.' : '\u00a0'}
          </div>
          <div className="session-log-actions">
            <CopyToClipboard
              text={logs.join('\r\n')}
              onCopy={this.handleLogsCopied}
            >
              <button>Copy Logs</button>
            </CopyToClipboard>
            <button onClick={this.handleOnlySelfButton}>
              {this.state.logsOnlySelf ? 'Show all' : 'Only me'}
            </button>
          </div>
        </div>
      </GameToolModal>
    );
  }
}

export default LogsPanel;
