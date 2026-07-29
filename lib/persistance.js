const name = 'atc-manager-2-game-persistance-v4';
let val = null;

const nullOrUndefined = x => x === undefined || x === null;
const defaultState = () => ({
  games: {},
  introTutorial: false,
  timelapses: {},
  settings: {}
});

const getStorage = () => {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch (error) {
    console.warn('Local storage is unavailable.', error);
    return null;
  }
};

const readJson = (storage, key, fallback) => {
  if (!storage) return fallback;
  try {
    const json = storage.getItem(key);
    return json === null ? fallback : JSON.parse(json);
  } catch (error) {
    console.warn(`Ignoring invalid saved data in "${key}".`, error);
    return fallback;
  }
};

const objectOr = (value, fallback) =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? value
    : fallback;

export const loadState = function () {
  if (val !== null) return val;

  const storage = getStorage();
  if (storage && readJson(storage, name, null) !== null) migrate(storage);

  const fallback = defaultState();
  val = {
    games: objectOr(readJson(storage, name + '-games', {}), fallback.games),
    introTutorial: !!readJson(
      storage,
      name + '-intro-tutorial',
      fallback.introTutorial
    ),
    timelapses: objectOr(
      readJson(storage, name + '-timelapses', {}),
      fallback.timelapses
    ),
    settings: objectOr(
      readJson(storage, name + '-settings', {}),
      fallback.settings
    )
  };
  return val;
};

export const saveState = function (state) {
  val = state || defaultState();
  const storage = getStorage();
  if (!storage) return;

  const gamesStr = JSON.stringify(val.games || {});
  const introTutorialStr = JSON.stringify(!!val.introTutorial);
  const timelapsesStr = JSON.stringify(val.timelapses || {});
  const settingsStr = JSON.stringify(val.settings || {});

  try {
    storage.setItem(name + '-games', gamesStr);
    storage.setItem(name + '-intro-tutorial', introTutorialStr);
    storage.setItem(name + '-timelapses', timelapsesStr);
    storage.setItem(name + '-settings', settingsStr);
  } catch (error) {
    console.warn('Unable to persist game data.', error);
  }
};

export const decimalFormatter = decimals => (key, val) =>
  !nullOrUndefined(val) && val.toFixed ? +val.toFixed(decimals) : val;

const migrate = storage => {
  const state = readJson(storage, name, null);
  if (!state || typeof state !== 'object') return;

  try {
    storage.setItem(name + '-games', JSON.stringify(state.games || {}));
    storage.setItem(
      name + '-intro-tutorial',
      JSON.stringify(!!state.introTutorial)
    );
    storage.setItem(
      name + '-timelapses',
      JSON.stringify(state.timelapses || {})
    );
    storage.setItem(name + '-settings', JSON.stringify(state.settings || {}));
    storage.removeItem(name);
  } catch (error) {
    console.warn('Unable to migrate legacy game data.', error);
  }
};

export const wipeServiceWorkerCache = async () => {
  if (typeof window !== 'undefined' && 'caches' in window) {
    const keys = await window.caches.keys();
    await Promise.all(keys.map(key => window.caches.delete(key)));
  }
};
