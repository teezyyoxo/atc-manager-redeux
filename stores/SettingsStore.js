import { EventEmitter } from 'events';
import Communications from '../lib/communications';
import { loadState, saveState } from '../lib/persistance';

const colorPalettes = [
  'approach',
  'oceanic',
  'amber',
  'violet',
  'tower-green',
  'cobalt',
  'crimson',
  'rose',
  'arctic',
  'graphite',
  'sandstone'
];
const interfaceFonts = [
  'ibm-plex-mono',
  'jetbrains-mono',
  'share-tech-mono'
];

class SettingsStore extends EventEmitter {
  constructor() {
    super();
    this.speechsynthesis = false;
    this.atcVoice = null;
    this.speechrecognition = false;
    this.voices = Communications.synth
      .getVoices()
      .filter(x => x.lang.startsWith('en'));
    this.backgroundColor = '#1e606b';
    this.selectedMapId = 'default';
    this.radarColor = '#194850';
    this.foregroundColor = '#ffffff';
    this.fontColor = '#ffffff';
    this.sidColor = '#a5742a';
    this.starColor = '#1e29eb';
    this.msaColor = '#a5742a';
    this.pathVisualizerColor = '#a5742a';
    this.inboundTrafficColor = '#99f';
    this.outboundTrafficColor = '#696';
    this.enrouteTrafficColor = '#b3b357';
    this.vfrTrafficColor = '#c28750';
    this.dangerColor = '#ff0000';
    this.descendColor = '#ff0000';
    this.millibars = false;
    this.climbColor = '#00ff00';
    this.rate = Communications.rate;
    this.voice = Communications.atcVoice;
    this.pitch = Communications.pitch;
    this.speed = 1;
    this.distanceCircles = true;
    this.distanceCircleColor = '#ffffff';
    this.distanceCirclesDistance = 200;
    this.distanceCirclesAmount = 5;
    this.sidsStars = false;
    this.routeVisualization = false;
    this.ilsPathLength = 250;
    this.ilsPathColor = '#8aa8ad';
    this.ilsDashInterval = [20, 30];
    this.useTextCmd = false;
    this.newPlaneInterval = 100;
    this.startingInboundPlanes = 3;
    this.startingOutboundPlanes = 2;
    this.startingEnroutePlanes = 1;
    this.radarFontsize = 14;
    this.interfaceScale = 'auto';
    this.themePreference = 'system';
    this.colorPalette = 'approach';
    this.interfaceFont = 'ibm-plex-mono';
    this.touchControlColor = '#62ff8d';
    this.ga = false;
    this.enroute = false;
    this.takeoffInOrder = false;
    this.goArounds = false;
    this.stopSpawn = false;
    this.autosaveEnabled = false;
    this.autosaveIntervalMinutes = 5;
    this.defaultSettings = JSON.parse(this.toJson());

    const persistedSettings = loadState().settings;
    if (persistedSettings) {
      Object.keys(persistedSettings).forEach(key => {
        if (!isNullOrUndefined(persistedSettings[key]))
          this[key] = persistedSettings[key];
      });
    }

    this.applyInterfaceScale();
    this.applyTheme();
    this.on('change', this.persist);
    this.on('change', this.applyInterfaceScale);
    this.on('change', this.applyTheme);

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleViewportResize);
      this.systemThemeMedia = window.matchMedia
        ? window.matchMedia('(prefers-color-scheme: dark)')
        : null;
      if (this.systemThemeMedia) {
        if (this.systemThemeMedia.addEventListener) {
          this.systemThemeMedia.addEventListener(
            'change',
            this.handleSystemThemeChange
          );
        } else if (this.systemThemeMedia.addListener) {
          this.systemThemeMedia.addListener(this.handleSystemThemeChange);
        }
      }
      this.applyTheme();
    }

    Communications.synth.addEventListener(
      'voiceschanged',
      this.handleVoicesChange
    );

    if (this.atcVoice) {
      Communications.atcVoice = this.voices.find(voice =>
        voice.name === this.atcVoice);
    }
  }

  persist = () => {
    const state = loadState();
    const settings = JSON.parse(this.toJson());
    Object.keys(settings).forEach(key => {
      if (
        JSON.stringify(settings[key]) ===
        JSON.stringify(this.defaultSettings[key])
      ) {
        delete settings[key];
      }
    });

    state.settings = settings;
    saveState(state);
  };

  handleVoicesChange = () => {
    this.voices = Communications.synth
      .getVoices()
      .filter(x => x.lang.startsWith('en'));
    if (Communications.atcVoice === undefined && this.atcVoice) {
      Communications.atcVoice = this.voices.find(voice => voice.name === this.atcVoice);
    }
    if (Communications.atcVoice === undefined) {
      Communications.atcVoice = this.voices[0];
      if (Communications.atcVoice) this.atcVoice = Communications.atcVoice.name;
    }
    this.emit('change');
  }

  changePitch = (pitch) => {
    Communications.pitch = pitch;
    this.pitch = pitch;
    this.emit('change');
  }

  changeRate = (rate) => {
    Communications.rate = rate;
    this.rate = rate;
    this.emit('change');
  }

  changeATCVoice = (voice) => {
    if (!voice) return;
    Communications.atcVoice = voice;
    this.atcVoice = voice.name;
    this.emit('change');
  }

  setSpeed = (speed) => {
    this.speed = speed;
    this.emit('change');
  }

  handleViewportResize = () => {
    if (this.interfaceScale === 'auto') this.applyInterfaceScale();
  };

  handleSystemThemeChange = () => {
    if (this.themePreference === 'system') this.applyTheme();
  };

  getInterfaceScale = () => {
    if (this.interfaceScale !== 'auto') {
      const scale = Number(this.interfaceScale);
      if (Number.isFinite(scale)) return Math.min(1.5, Math.max(0.75, scale));
    }
    if (typeof window === 'undefined') return 1;

    const width = window.innerWidth;
    const height = window.innerHeight;

    if (height <= 500) return 0.9;
    if (width >= 1400) return 1.15;
    if (width >= 768) return 1.1;
    if (width <= 480) return 0.95;
    return 1;
  };

  applyInterfaceScale = () => {
    if (typeof document === 'undefined') return;
    const scale = this.getInterfaceScale();
    const rootStyle = document.documentElement.style;
    rootStyle.setProperty('--interface-scale', scale);
    rootStyle.setProperty('--interface-font-size', `${14 * scale}px`);
    rootStyle.setProperty('--interface-sidebar-width', `${280 * scale}px`);
    rootStyle.setProperty('--interface-compact-sidebar-width', `${220 * scale}px`);
  };

  applyTheme = () => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const colorPalette = colorPalettes.includes(this.colorPalette)
      ? this.colorPalette
      : 'approach';
    const interfaceFont = interfaceFonts.includes(this.interfaceFont)
      ? this.interfaceFont
      : 'ibm-plex-mono';
    const preference = ['system', 'light', 'dark'].includes(
      this.themePreference
    )
      ? this.themePreference
      : 'system';

    root.setAttribute('data-palette', colorPalette);
    root.setAttribute('data-interface-font', interfaceFont);

    const systemPrefersDark = this.systemThemeMedia
      ? this.systemThemeMedia.matches
      : typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
        : true;
    const effectiveTheme = preference === 'system'
      ? systemPrefersDark ? 'dark' : 'light'
      : preference;
    root.setAttribute('data-theme', effectiveTheme);
    root.style.colorScheme = effectiveTheme;

    const isDark = effectiveTheme === 'dark';
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      const backgroundColor = window.getComputedStyle(root)
        .getPropertyValue('--ui-bg')
        .trim();
      themeColor.setAttribute(
        'content',
        backgroundColor || (isDark ? '#071416' : '#eef5f2')
      );
    }
  };

  toJson = () => {
    return JSON.stringify(
      this,
      [
        'selectedMapId',
        'speechsynthesis',
        'speechrecognition',
        'atcVoice',
        'pitch',
        'rate',
        'speed',
        'newPlaneInterval',
        'startingInboundPlanes',
        'startingOutboundPlanes',
        'startingEnroutePlanes',
        'distanceCircles',
        'distanceCirclesDistance',
        'takeoffInOrder',
        'useTextCmd',
        'goArounds',
        'stopSpawn',
        'autosaveEnabled',
        'autosaveIntervalMinutes',
        'distanceCirclesAmount',
        'radarFontsize',
        'interfaceScale',
        'themePreference',
        'colorPalette',
        'interfaceFont',
        'touchControlColor',
        'distanceCircleColor',
        'ilsPathLength',
        'ilsPathColor',
        'ilsDashInterval',
        'sepVialationCircleColor',
        'ga',
        'enroute',
        'sidsStars',
        'routeVisualization',
        'backgroundColor',
        'radarColor',
        'foregroundColor',
        'fontColor',
        'sidColor',
        'starColor',
        'msaColor',
        'pathVisualizerColor',
        'inboundTrafficColor',
        'outboundTrafficColor',
        'enrouteTrafficColor',
        'millibars',
        'vfrTrafficColor',
        'dangerColor',
        'descendColor',
        'climbColor'
      ],
      4
    );
  };
}

const isNullOrUndefined = val => val === undefined || val === null;

export default new SettingsStore();
