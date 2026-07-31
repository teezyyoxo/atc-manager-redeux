import 'react-github-button/assets/style.css';
import './style';
import { Component } from 'preact';
import Router from 'preact-router';
import { createHashHistory } from 'history';
import Game from 'async!./containers/Game/Game';
// import GroundGame from 'async!./containers/GroundGame/GroundGame';
import Home from 'async!./containers/Home/Home';
import { EventEmitter } from 'events';
import NotFound from 'async!./containers/NotFound/NotFound';
import EditorsRoot from 'async!./containers/EditorsRoot/EditorsRoot';
import { GameMessages } from './components/GameMessages/GameMessages';
import ReleaseNotesModal from './components/ReleaseNotesModal/ReleaseNotesModal';
// import AptDat from 'async!./containers/AptDat/AptDat';
import TimelapseRoot from 'async!./containers/TimelapseRoot/TimelapseRoot';
import TutorialsRoot from './containers/TutorialsRoot/TutorialsRoot';
import TutorialsIntro from './containers/TutorialsIntro/TutorialsIntro';
import TutorialsTextCommands from './containers/TutorialsTextCommands/TutorialsTextCommands';
import WhatsNew from 'async!./containers/WhatsNew/WhatsNew';
import { loadCSS, loadJS } from './lib/lazy-load';

if (typeof window !== 'undefined') {
  loadCSS('https://fonts.googleapis.com/css?family=Roboto+Mono');
  loadJS('https://buttons.github.io/buttons.js');
}

export const router = new EventEmitter();
export const history = typeof window !== 'undefined' ? createHashHistory() : undefined; // enable pre rendering
export default class App extends Component {
  render() {
    return (
      <main>
        <Router
          history={history}
          onChange={event => router.emit('change', event)}
        >
          <Home path="/" />
          <Game path="/game" />
          {/* <GroundGame path="/game-ground" /> */}
          <EditorsRoot path="/editor/:editorroute" />
          <TimelapseRoot path="/timelapse/:timelapseroute" />
          {/* <AptDat path="/apt-dat" /> */}
          <TutorialsRoot path="tutorials" />
          <TutorialsIntro path="tutorials/intro" />
          <TutorialsTextCommands path="tutorials/text-commands" />
          <WhatsNew path="/whats-new" />
          <NotFound default />
        </Router>
        <GameMessages />
        <ReleaseNotesModal />
      </main>
    );
  }
}
