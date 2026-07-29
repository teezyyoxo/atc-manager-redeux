import {
  operatorsById,
} from './airplane-library/airplane-library';
import { codeToNato } from './communications';

const onlyUnique = (value, index, self) => self.indexOf(value) === index;

const SpeechRecognition =
  typeof window !== 'undefined' &&
  (window.SpeechRecognition || window.webkitSpeechRecognition);
const SpeechGrammarList =
  typeof window !== 'undefined' &&
  (window.SpeechGrammarList || window.webkitSpeechGrammarList);

const isSupported =
  typeof SpeechRecognition !== 'undefined' &&
  typeof SpeechGrammarList !== 'undefined';

const range = (min, max, step) => {
  const length = (max - min) / step;
  const arr = new Array(Math.ceil(length));

  for (let i = 0; i <= length; i++) {
    arr[i] = min + i * step;
  }

  return arr;
};

const defaultOptions = {
  headingPrecision: 5,
  speedPrecision: 5
};

const createInstance = (options = defaultOptions) => {
  const realOptions = { ...defaultOptions, ...options };
  if (!isSupported) return { addAirplane: () => {} };
  const recognition = new SpeechRecognition();
  const speechRecognitionList = new SpeechGrammarList();

  recognition.grammars = speechRecognitionList;
  recognition.continuous = false;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = function (event) {
    // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
    // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
    // It has a getter so it can be accessed like an array
    // The first [0] returns the SpeechRecognitionResult at the last position.
    // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
    // These also have getters so they can be accessed like arrays.
    // The second [0] returns the SpeechRecognitionAlternative at position 0.
    // We then return the transcript property of the SpeechRecognitionAlternative object
    return event.results[0][0].transcript;
  };

  recognition.onspeechend = function () {
    recognition.stop();
  };

  recognition.onnomatch = function () {};

  recognition.onerror = function () {};

  return {
    addAirplane: airplane => {
      const { operatorId } = airplane;
      const { callsign, name, shortName } = operatorsById[operatorId];

      const uniqueIdentifiers = [callsign, name, shortName].filter(onlyUnique);

      const headings = range(0, 360, realOptions.headingPrecision);

      const turnGrammer = `#JSGF V1.0;
      // Grammer for turning an airplane
      grammar turn; 
      public <turncommand> = <identifier> <command>;
      <identifier> = ( ${uniqueIdentifiers.join(' | ')} );
      <command> = <turn> [heading] ( ${headings.join(' | ')} ) ;
      <turn> = turn [ <leftorright> ] ;
      <leftorright> = ( left | right ) ;`;

      speechRecognitionList.addFromString(turnGrammer, 1);

      const altitudes = range(2000, 30000, 1000);

      const altitudeGrammer = `#JSGF V1.0;
      // Grammer for changing the altitude of an airplane
      grammar altitude; 
      public <altitudecommand> = <identifier> <command>;
      <identifier> = ( ${uniqueIdentifiers.join(' | ')} );
      <command> = <altitudeaction> ( ${altitudes.join(' | ')} ) [feet] ;
      <altitudeaction> = ( climb | descend ) [extra] ;
      <extra> = ( and maintain | to ) ;`;

      speechRecognitionList.addFromString(altitudeGrammer, 1);
      const natoWaypoints = realOptions.waypoints.map(codeToNato);

      const directGrammer = `#JSGF V1.0;
      // Grammer for directing an airplane to a waypoint
      grammar direct; 
      public <directcommand> = <identifier> <command>;
      <identifier> = ( ${uniqueIdentifiers.join(' | ')} );
      <command> = <directaction> (<waypoints> | <waypointsnato>) ; 
      <waypoints> = ( ${realOptions.waypoints.join(' | ')} ) ;
      <waypointsnato> = ( ${natoWaypoints.join(' | ')} ) ;
      <directaction> = direct [<extra>] ;
      <extra> = ( to | for ) ;`;

      speechRecognitionList.addFromString(directGrammer, 1);

      const goAroundGrammer = `#JSGF V1.0;
      // Grammer for directing an airplane to go around
      grammar goaround; 
      public <goaroundcommand> = <identifier> go around;
      <identifier> = ( ${uniqueIdentifiers.join(' | ')} );`;

      speechRecognitionList.addFromString(goAroundGrammer, 1);

      const speeds = range(140, 340, realOptions.speedPrecision);

      const speedGrammer = `#JSGF V1.0;
      // Grammer for changing an airplane's speed
      grammar speed; 
      public <speedcommand> = <identifier> go around;
      <identifier> = ( ${uniqueIdentifiers.join(' | ')} );
      <command> = <speedaction> <speed> ;
      <speedaction> = speed (to) ;
      <speed> = ( ${speeds.join(' | ')} ) ;`;

      speechRecognitionList.addFromString(speedGrammer, 1);

      const takeoffGrammer = `#JSGF V1.0;
      // Grammer for directing an airplane to take off
      grammar goaround; 
      public <goaroundcommand> = <identifier> take off;
      <identifier> = ( ${uniqueIdentifiers.join(' | ')} );`;

      speechRecognitionList.addFromString(takeoffGrammer, 1);
    }
  };
};


export default createInstance;
