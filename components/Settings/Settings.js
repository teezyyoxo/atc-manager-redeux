import { Component } from 'preact';
import SettingsStore from '../../stores/SettingsStore';
import { FaCompress, FaExpand } from 'react-icons/fa/index.esm';
import { wipeServiceWorkerCache } from '../../lib/persistance';
import ThemeControl from '../ThemeControl/ThemeControl';

const SettingRow = ({ label, children, className = '' }) => (
  <div className={`settings-row ${className}`}>
    <span className="settings-label">{label}</span>
    <div className="settings-control">{children}</div>
  </div>
);

const ToggleControl = ({ label, checked, onInput }) => (
  <label className="switch" aria-label={label}>
    <input type="checkbox" onInput={onInput} checked={checked} />
    <span className="slider" />
  </label>
);

const RangeControl = ({ label, value, suffix, ...props }) => (
  <div className="range-slider settings-range-control">
    <input
      {...props}
      aria-label={label}
      className="range-slider__range"
      type="range"
      value={value}
    />
    <span className="range-slider__value">{value}{suffix}</span>
  </div>
);

const colorSettings = [
  ['touchControlColor', 'Touch Control Display Color'],
  ['ilsPathColor', 'ILS Indicator Color'],
  ['dangerColor', 'Danger Color'],
  ['backgroundColor', 'Background Color'],
  ['foregroundColor', 'Foreground Color'],
  ['radarColor', 'Radar Color'],
  ['sidColor', 'SID Color'],
  ['starColor', 'STAR Color'],
  ['inboundTrafficColor', 'Inbound Traffic Color'],
  ['enrouteTrafficColor', 'Enroute Traffic Color'],
  ['outboundTrafficColor', 'Outbound Traffic Color'],
  ['vfrTrafficColor', 'VFR Traffic Color'],
  ['pathVisualizerColor', 'Path Color'],
  ['climbColor', 'Climb Color'],
  ['descendColor', 'Descent Color'],
  ['msaColor', 'MSA Color']
];

const interfaceFonts = [
  ['ibm-plex-mono', 'IBM Plex Mono'],
  ['jetbrains-mono', 'JetBrains Mono'],
  ['share-tech-mono', 'Share Tech Mono']
];

const colorPalettes = [
  ['approach', 'Approach Mint'],
  ['oceanic', 'Oceanic Blue'],
  ['amber', 'Amber Scope'],
  ['violet', 'Violet Dusk'],
  ['tower-green', 'Tower Green'],
  ['cobalt', 'Cobalt Night'],
  ['crimson', 'Crimson Vector'],
  ['rose', 'Rose Quartz'],
  ['arctic', 'Arctic Ice'],
  ['graphite', 'Graphite'],
  ['sandstone', 'Desert Sand']
];

const mapViews = [
  ['radar', 'Radar Scope'],
  ['street', 'Street Map'],
  ['terrain', 'Terrain Map'],
  ['satellite', 'Satellite Imagery']
];

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      difficulty: 'normal',
      appearanceExpanded: !!props.appearanceInitiallyExpanded
    };
  }

  componentDidMount() {
    SettingsStore.on('change', this.handleSettingsStoreChange);
  }

  componentWillUnmount() {
    SettingsStore.removeListener('change', this.handleSettingsStoreChange);
  }

  handleSettingsStoreChange = () => {
    this.setState({});
  };

  handleNewPlaneIntervalChange = event => {
    SettingsStore.newPlaneInterval = +event.target.value;
    SettingsStore.emit('change');
  };

  handleRadarFontSizeChange = event => {
    SettingsStore.radarFontsize = +event.target.value;
    SettingsStore.emit('change');
  };

  handleInterfaceScaleChange = event => {
    SettingsStore.interfaceScale =
      event.target.value === 'auto' ? 'auto' : +event.target.value;
    SettingsStore.emit('change');
  };

  handleInterfaceFontChange = event => {
    SettingsStore.interfaceFont = event.target.value;
    SettingsStore.emit('change');
  };

  handleColorPaletteChange = event => {
    SettingsStore.colorPalette = event.target.value;
    SettingsStore.emit('change');
  };

  handleSpeechVoiceChange = event => {
    SettingsStore.changeATCVoice(SettingsStore.voices.find(voice =>
      voice.name === event.target.value));
  };

  handlePitchChange = event => {
    SettingsStore.changePitch(+event.target.value);
  };

  handleRateChange = event => {
    SettingsStore.changeRate(+event.target.value);
  };

  handleSpeedChange = event => {
    SettingsStore.setSpeed(+event.target.value);
  };

  handleAutosaveIntervalChange = event => {
    SettingsStore.autosaveIntervalMinutes = +event.target.value;
    SettingsStore.emit('change');
  };

  handleDifficultyChange = event => {
    switch (event.target.value) {
      case 'easy':
        SettingsStore.startingInboundPlanes = 1;
        SettingsStore.startingOutboundPlanes = 1;
        SettingsStore.startingEnroutePlanes = 0;
        SettingsStore.newPlaneInterval = 180;
        break;
      case 'normal':
        SettingsStore.startingInboundPlanes = 3;
        SettingsStore.startingOutboundPlanes = 2;
        SettingsStore.startingEnroutePlanes = 1;
        SettingsStore.newPlaneInterval = 100;
        break;
      case 'hard':
        SettingsStore.startingInboundPlanes = 4;
        SettingsStore.startingOutboundPlanes = 3;
        SettingsStore.startingEnroutePlanes = 0;
        SettingsStore.newPlaneInterval = 70;
        break;
    }
    this.setState({ difficulty: event.target.value });
    SettingsStore.emit('change');
  };

  handleAppearanceExpanded = () => {
    this.setState({ appearanceExpanded: !this.state.appearanceExpanded });
  };

  handleChange = name => event => {
    SettingsStore[name] = event.target.value;
    SettingsStore.emit('change');
  };

  handleNumericChange = name => event => {
    SettingsStore[name] = +event.target.value;
    SettingsStore.emit('change');
  };

  handleCheckboxChange = name => event => {
    SettingsStore[name] = event.target.checked;
    SettingsStore.emit('change');
  };

  clearCaches = async () => {
    await wipeServiceWorkerCache();
    alert('Caches have been cleared. This does not affect your saves.');
  };

  renderToggleRow = (name, label, className = '') => (
    <SettingRow label={label} className={`settings-row-toggle ${className}`}>
      <ToggleControl
        label={label}
        checked={SettingsStore[name]}
        onInput={this.handleCheckboxChange(name)}
      />
    </SettingRow>
  );

  render() {
    const atcVoiceName = SettingsStore.atcVoice || '';
    return (
      <div className="settings">
        <div className="settings-group" aria-label="Session settings">
          <SettingRow label="Game Speed" className="settings-row-range">
            <RangeControl
              label="Game Speed"
              min="0.1"
              max="10"
              step="0.1"
              value={SettingsStore.speed}
              suffix="x"
              onInput={this.handleSpeedChange}
            />
          </SettingRow>

          <SettingRow label="Difficulty" className="settings-row-select">
            <select
              aria-label="Difficulty"
              value={this.state.difficulty}
              onInput={this.handleDifficultyChange}
            >
              <option value="easy">Easy</option>
              <option value="normal">Normal</option>
              <option value="hard">Hard</option>
            </select>
          </SettingRow>

          {this.renderToggleRow('ga', 'General Aviation')}
          {this.renderToggleRow('enroute', 'Enroute Traffic')}
          {SettingsStore.stopSpawn ? null : (
            <SettingRow
              label="Aircraft Spawn Interval"
              className="settings-row-range"
            >
              <RangeControl
                label="Aircraft Spawn Interval"
                min="10"
                max="400"
                step="10"
                value={SettingsStore.newPlaneInterval}
                suffix=" sec"
                onInput={this.handleNewPlaneIntervalChange}
              />
            </SettingRow>
          )}
          {this.renderToggleRow('stopSpawn', 'Stop Aircraft Spawning')}
          {this.renderToggleRow('goArounds', 'Go-Arounds')}
          {this.renderToggleRow('takeoffInOrder', 'Takeoff in Order')}
          {this.renderToggleRow('millibars', 'Millibars')}
          {this.renderToggleRow('sidsStars', 'SIDs/STARs')}
          {this.renderToggleRow('useTextCmd', 'Text Commands')}
          {this.renderToggleRow('autosaveEnabled', 'Autosave')}
          {SettingsStore.autosaveEnabled ? (
            <SettingRow label="Autosave Interval" className="settings-row-select">
              <select
                aria-label="Autosave Interval"
                value={SettingsStore.autosaveIntervalMinutes}
                onInput={this.handleAutosaveIntervalChange}
              >
                <option value="1">Every Minute</option>
                <option value="2">Every 2 Minutes</option>
                <option value="5">Every 5 Minutes</option>
                <option value="10">Every 10 Minutes</option>
                <option value="15">Every 15 Minutes</option>
              </select>
            </SettingRow>
          ) : null}
        </div>

        <button
          type="button"
          className="settings-section-toggle"
          aria-expanded={this.state.appearanceExpanded}
          aria-controls="appearance-settings"
          onClick={this.handleAppearanceExpanded}
        >
          <span>
            {this.state.appearanceExpanded ? <FaCompress /> : <FaExpand />}
            Appearance Settings
          </span>
          <span aria-hidden="true">
            {this.state.appearanceExpanded ? '−' : '+'}
          </span>
        </button>
        <div
          id="appearance-settings"
          className={`settings-group settings-collapsible ${
            this.state.appearanceExpanded ? '' : 'hidden'
          }`}
        >
          <SettingRow label="Display Mode" className="settings-row-theme">
            <ThemeControl />
          </SettingRow>
          <SettingRow label="Color Theme" className="settings-row-select">
            <select
              aria-label="Color Theme"
              value={SettingsStore.colorPalette}
              onInput={this.handleColorPaletteChange}
            >
              {colorPalettes.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </SettingRow>
          <SettingRow label="Map View" className="settings-row-select">
            <div>
              <select
                aria-label="Map View"
                value={SettingsStore.mapView}
                onInput={this.handleChange('mapView')}
              >
                {mapViews.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <small className="settings-device-note">
                Geographic views load live tiles; radar symbology stays on top.
              </small>
            </div>
          </SettingRow>
          <SettingRow label="Interface Font" className="settings-row-select">
            <div className="settings-font-control">
              <select
                aria-label="Interface Font"
                value={SettingsStore.interfaceFont}
                onInput={this.handleInterfaceFontChange}
              >
                {interfaceFonts.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <small className="settings-font-preview">
                EHAM APP · AAL1634 · 11000FT
              </small>
            </div>
          </SettingRow>
          {this.renderToggleRow('distanceCircles', 'Distance Circles')}
          {this.renderToggleRow('routeVisualization', 'Route Visualization')}
          <SettingRow label="Radar Font Size" className="settings-row-range">
            <RangeControl
              label="Radar Font Size"
              min="8"
              max="30"
              step="1"
              value={SettingsStore.radarFontsize}
              suffix=" px"
              onInput={this.handleRadarFontSizeChange}
            />
          </SettingRow>
          <SettingRow
            label="Logs Panel Opacity"
            className="settings-row-range"
          >
            <RangeControl
              label="Logs Panel Opacity"
              min="35"
              max="100"
              step="5"
              value={SettingsStore.logsPanelOpacity}
              suffix="%"
              onInput={this.handleNumericChange('logsPanelOpacity')}
            />
          </SettingRow>
          <SettingRow
            label="Logs Background Blur"
            className="settings-row-range"
          >
            <RangeControl
              label="Logs Background Blur"
              min="0"
              max="30"
              step="1"
              value={SettingsStore.logsPanelBlur}
              suffix=" px"
              onInput={this.handleNumericChange('logsPanelBlur')}
            />
          </SettingRow>
          <SettingRow label="Interface Scale" className="settings-row-select">
            <div>
              <select
                aria-label="Interface Scale"
                value={SettingsStore.interfaceScale}
                onInput={this.handleInterfaceScaleChange}
              >
                <option value="auto">Automatic for This Display</option>
                <option value="0.75">75%</option>
                <option value="0.9">90%</option>
                <option value="1">100%</option>
                <option value="1.1">110%</option>
                <option value="1.25">125%</option>
                <option value="1.5">150%</option>
              </select>
              <small className="settings-device-note">
                Saved only in this browser profile.
              </small>
            </div>
          </SettingRow>
          {colorSettings.map(([name, label]) => (
            <SettingRow
              label={label}
              className="settings-row-color"
              key={name}
            >
              <input
                type="color"
                aria-label={label}
                value={SettingsStore[name]}
                onInput={this.handleChange(name)}
              />
            </SettingRow>
          ))}
        </div>

        <div className="settings-utility-row">
          <button type="button" onClick={this.clearCaches}>
            Clear Caches
          </button>
          <small>Does not affect saved sessions.</small>
        </div>

        <div
          id="speech-settings"
          className="settings-group settings-speech-group"
          aria-label="Speech synthesis settings"
        >
          {this.renderToggleRow('speechsynthesis', 'Speech Synthesis')}
          {SettingsStore.speechsynthesis ? (
            <div>
              <SettingRow label="Voice" className="settings-row-select">
                <select
                  aria-label="Speech Synthesis Voice"
                  onInput={this.handleSpeechVoiceChange}
                  value={atcVoiceName}
                >
                  {SettingsStore.voices.length ? null : (
                    <option value="">No English Voices Available</option>
                  )}
                  {SettingsStore.voices.map(voice => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} — {voice.lang}
                    </option>
                  ))}
                </select>
              </SettingRow>
              <SettingRow label="Pitch" className="settings-row-range">
                <RangeControl
                  label="Speech Pitch"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={SettingsStore.pitch}
                  suffix="x"
                  onInput={this.handlePitchChange}
                />
              </SettingRow>
              <SettingRow label="Rate" className="settings-row-range">
                <RangeControl
                  label="Speech Rate"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={SettingsStore.rate}
                  suffix="x"
                  onInput={this.handleRateChange}
                />
              </SettingRow>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default Settings;
