import GameStore from '../stores/GameStore';
import { saveState, loadState, decimalFormatter } from './persistance';
import {
  sendMessageWarning,
  sendMessageInfo
} from '../components/GameMessages/GameMessages';

export const saveCurrentGame = () => {
  const game = JSON.parse(
    JSON.stringify(GameStore.toJson(), decimalFormatter(2))
  );
  const state = loadState();
  const name = prompt(
    'Name of your save?',
    `${GameStore.mapName} - ${new Date().toLocaleDateString()}`
  );
  if (!name) {
    sendMessageWarning('Please give a valid name...');
    return false;
  }
  if (
    state.games[name] &&
    !confirm('This save already exists. Do you want to overwrite it?')
  ) {
    sendMessageWarning(`${name} was not saved...`);
    return false;
  }
  state.games[name] = game;
  saveState(state);
  sendMessageInfo(`${name} was saved...`);
  return true;
};
