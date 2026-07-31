import { Component } from 'preact';
import SettingsStore from '../../stores/SettingsStore';

const themes = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' }
];

class ThemeControl extends Component {
  componentDidMount() {
    SettingsStore.on('change', this.handleSettingsChange);
  }

  componentWillUnmount() {
    SettingsStore.removeListener('change', this.handleSettingsChange);
  }

  handleSettingsChange = () => {
    this.setState({});
  };

  handleThemeChange = themePreference => {
    SettingsStore.themePreference = themePreference;
    SettingsStore.emit('change');
  };

  render() {
    return (
      <div className="theme-control" aria-label="Display mode">
        {themes.map(theme => (
          <button
            type="button"
            key={theme.value}
            className={
              SettingsStore.themePreference === theme.value
                ? 'theme-option active'
                : 'theme-option'
            }
            onClick={() => this.handleThemeChange(theme.value)}
            aria-pressed={SettingsStore.themePreference === theme.value}
          >
            {theme.label}
          </button>
        ))}
      </div>
    );
  }
}

export default ThemeControl;
