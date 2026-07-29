import { EventEmitter } from 'events';
import { sendMessageError } from '../components/GameMessages/GameMessages';
import { parseApt } from '../lib/ground/spec';
import { logErr } from '../lib/util';

class AptDatStore extends EventEmitter {
  constructor() {
    super();

    const url = (this.url = 'https://esstudio.site/apt-dat-parser-js/data/');

    this.loading = true;
    const fetchText = async path => {
      const response = await fetch(url + path);
      if (!response.ok) {
        throw new Error(`World-data request failed (${response.status}).`);
      }
      return response.text();
    };
    const aptNavPromise = fetchText('apt_nav.dat.txt');
    const earthFixPromise = fetchText('earth_fix.dat.txt');
    const earthNavPromise = fetchText('earth_nav.dat.txt');

    this.datPromise = Promise.all([
      aptNavPromise,
      earthFixPromise,
      earthNavPromise
    ])
      .then(this.handleDataloaded)
      .catch(err => {
        sendMessageError('Something went wrong while loading world data.');
        logErr(err);
        throw err;
      });
  }

  handleDataloaded = resolved => {
    this.loading = false;
    this.emit('change');

    return resolved;
  };

  searchAptNavIcao = icao => {
    icao = icao.toUpperCase();
    return this.datPromise.then(resolved => {
      const [aptNav] = resolved;

      return aptNav
        .split('\n')
        .filter(apt => apt.trim().split(/\s+/)[0] === icao);
    });
  };

  searchAptName = name => {
    return this.datPromise.then(resolved => {
      const [aptNav] = resolved;

      return aptNav.split('\n').filter(apt =>
        apt
          .split(' ')
          .slice(3)
          .join(' ')
          .includes(name)
      );
    });
  };

  fetchAptByIcao = async icao => {
    icao = icao.toUpperCase();
    const response = await fetch(this.url + `airports/${icao}.dat.txt`);
    if (!response.ok) {
      throw new Error(`Airport data request failed (${response.status}).`);
    }
    const txt = await response.text();

    const apt = parseApt(txt, true)[0];
    if (!apt) throw new Error(`No airport data found for ${icao}.`);
    return apt;
  };
}

export default new AptDatStore();
