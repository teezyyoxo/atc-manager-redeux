import { EventEmitter } from 'events';
import { loadState, saveState } from '../lib/persistance';
import { patch, clone } from 'jsondiffpatch';
import { sendMessageWarning, sendMessageInfo } from '../components/GameMessages/GameMessages';
import config from '../lib/config';
import GameStore from './GameStore';
import { loadMap } from '../lib/map';
import TimelapseStore from './TimelapseStore';

const createChart = (data, clampLength) => {
  if (data.length < clampLength) return data.slice(0);
  const chart = new Array(clampLength);
  const step = data.length / clampLength;
  for (let i = 0, j = 0; i < clampLength; i++, j += step) {
    chart[i] = data[Math.floor(j)];
  }
  return chart;
};

const promiseMeATimelapse = timelapse =>
  new Promise(res => {
    const states = new Array(timelapse.patches.length);
    let i = 0;
    let cursor = clone(timelapse.start);
    const len = timelapse.patches.length;
    const interval = setInterval(() => {
      let max = Math.min(i + 200, len);
      for (; i < max; i++) {
        states[i] = clone(patch(cursor, timelapse.patches[i]));
        states[i].trafficLength = states[i].traffic.length;
      }
      if (i >= timelapse.patches.length) {
        clearInterval(interval);
        const start = clone(timelapse.start);
        start.trafficLength = Array.isArray(start.traffic)
          ? start.traffic.length
          : 0;
        states.unshift(start);
        return res(states);
      }
    }, 50);
  });

class TimelapsePlaybackStore extends EventEmitter {
  constructor() {
    super();
    this.timelapse = null;
    this.states = null;
    this.chart = null;
    this.index = 0;
    this.interval = null;
    this.speed = 1;
  }

  play = () => {
    if (this.interval !== null) this.stop();
    else if (this.states && this.index >= this.states.length) this.index = 0;
    this.interval = setInterval(this.update, config.updateTimelapseInterval);
    this.emit('change');
  };

  stop = () => {
    if (this.interval !== null) {
      clearInterval(this.interval);
      this.interval = null;
      this.emit('change');
    }
  };

  toggle = () => {
    if (this.interval !== null) this.stop();
    else this.play();
  };

  update = () => {
    if (!this.states || this.index >= this.states.length)
      return this.stop();
    GameStore.loadJson(this.states[Math.floor(this.index)]);
    const nextIndex = this.index + this.speed;
    const finished = nextIndex >= this.states.length;
    this.index = finished ? this.states.length - 1 : nextIndex;
    if (Math.abs(this.index - Math.round(this.index)) < 0.00001)
      this.index = Math.round(this.index);
    if (finished) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.emit('change');
    GameStore.emit('change');
  };

  save = () => {
    const timelapse = this.timelapse;
    const state = loadState();
    state.timelapses = state.timelapses || {};
    let name = prompt(
      'Name of your timelapse?',
      TimelapseStore.defaultTimelapseName()
    );
    if (!name) {
      sendMessageWarning('Please give a valid name...');
      return false;
    }
    if (state.timelapses[name]) {
      var result = confirm(
        'This timelapse already exists. Do you want to overwrite it?'
      );
      if (result === false) {
        sendMessageWarning(`${name} was not saved...`);
        return false;
      }
    }
    state.timelapses[name] = timelapse;
    saveState(state);
    sendMessageInfo(`${name} was saved...`);
    return name;
  };

  saveGame() {
    const game = GameStore.toJson();
    const state = loadState();
    let name = prompt(
      'Name of your save?',
      `${GameStore.mapName} - ${new Date().toLocaleDateString()}`
    );
    if (!name) {
      sendMessageWarning('Please give a valid name...');
      return false;
    }
    if (state.games[name]) {
      var result = confirm(
        'This save already exists. Do you want to overwrite it?'
      );
      if (result === false) {
        sendMessageWarning(`${name} was not saved...`);
        return false;
      }
    }
    state.games[name] = game;
    saveState(state);
    sendMessageInfo(`${name} was saved...`);
    return true;
  }

  loadPromise(timelapse) {
    if (
      !timelapse ||
      !timelapse.start ||
      !Array.isArray(timelapse.patches)
    ) {
      return Promise.reject(new Error('Invalid timelapse data.'));
    }
    return promiseMeATimelapse(timelapse).then(states => {
      this.timelapse = timelapse;
      this.index = 0;
      this.states = states;
      this.chart = createChart(states, 50);
      const map = loadMap(states[0].id);
      GameStore.loadJson(clone(states[0]));
      GameStore.map = map;
      GameStore.setup(map);
      GameStore.pause();
      this.emit('change');
    });
  }

  scrub(frames) {
    if (!this.timelapse) throw new Error('No timelapse is loaded.');
    if (frames < 0 || frames >= this.states.length)
      throw new Error('Not enough frames in timelapse.');
    this.index = Math.floor(frames);
    GameStore.loadJson(this.states[this.index]);
    GameStore.emit('change');
    this.emit('change');
  }
}

export default new TimelapsePlaybackStore();
