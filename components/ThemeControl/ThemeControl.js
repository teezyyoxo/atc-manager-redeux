import { Component } from 'preact';
import SettingsStore from '../../stores/SettingsStore';
import { FaAdjust, FaMoon, FaSun } from 'react-icons/fa/index.esm';

const themes = [
  { value: 'system', label: 'System', icon: <FaAdjust /> },
  { value: 'light', label: 'Light', icon: <FaSun /> },
  { value: 'dark', label: 'Dark', icon: <FaMoon /> }
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
            aria-label={`${theme.label} display mode`}
            title={theme.label}
          >
            {theme.icon}
            <span className="visually-hidden">{theme.label}</span>
          </button>
        ))}
      </div>
    );
  }
}

export default ThemeControl;
