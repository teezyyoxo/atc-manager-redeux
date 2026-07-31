import { EventEmitter } from 'events';
import GameStore from '../stores/GameStore';
import { saveState, loadState, decimalFormatter } from './persistance';
import { sendMessageWarning } from '../components/GameMessages/GameMessages';

export const SAVE_NAME_SEPARATOR = ' - ';
export const saveEvents = new EventEmitter();

export const createSessionSaveName = (date = new Date()) => {
  const airport = (GameStore.mapName || GameStore.id || 'SESSION').toUpperCase();
  const timestamp = date.toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
  return `${airport}${SAVE_NAME_SEPARATOR}${timestamp}`;
};

export const saveCurrentGame = ({
  name,
  type = 'manual',
  adoptName = true
} = {}) => {
  if (!GameStore.started) return false;
  const saveName = (name || GameStore.saveName || createSessionSaveName()).trim();
  if (!saveName) {
    sendMessageWarning('Enter a valid save name.');
    return false;
  }

  try {
    const game = JSON.parse(
      JSON.stringify(GameStore.toJson(), decimalFormatter(2))
    );
    const state = loadState();
    state.games[saveName] = game;
    saveState(state);
    if (adoptName) GameStore.saveName = saveName;
    saveEvents.emit('saved', { name: saveName, type });
    return true;
  } catch (error) {
    sendMessageWarning('The session could not be saved in this browser.');
    saveEvents.emit('error', error);
    return false;
  }
};
