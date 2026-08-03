import { Component } from 'preact';
import './SettingsPanel.css';
import Settings from '../../components/Settings/Settings';
import GameToolModal from '../../components/GameToolModal/GameToolModal';

class SettingsPanel extends Component {
  constructor(props) {
    super();
    this.state = {};
  }

  render() {
    if (!this.props.expanded) return null;
    return (
      <GameToolModal
        title="Options"
        titleId="game-options-title"
        kicker="Session Controls"
        onClose={this.props.onToggle}
        className="game-options-modal"
        overlayClassName="game-options-modal-overlay"
        footer={(
          <button type="button" onClick={this.props.onToggle}>
            Close Options
          </button>
        )}
      >
        <Settings appearanceInitiallyExpanded />
      </GameToolModal>
    );
  }
}

export default SettingsPanel;
