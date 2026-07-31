import { Component } from 'preact';
import './TimelapseContainer.css';
import {
  FaShareAlt,
  FaPlayCircle,
  FaDesktop,
  FaSave
} from 'react-icons/fa/index.esm';
import FullscreenableTimelapseViewer from '../FullscreenableTimelapseViewer/FullscreenableTimelapseViewer';
import TimelapsePlaybackStore from '../../stores/TimelapsePlaybackStore';
import { gamestoreFramesTimeFmt } from '../../lib/util';
import GameStore from '../../stores/GameStore';
import { saveAs } from 'file-saver';
import TimelapseStore from '../../stores/TimelapseStore';
import { route } from 'preact-router';
import SavedGamesOpen from '../../components/SavedGamesOpen/SavedGamesOpen';
import TimelapseChart from '../../components/TimelapseChart/TimelapseChart';
import { sendMessageError, sendMessageInfo } from '../../components/GameMessages/GameMessages';
import { shareOrDownloadTimelapse } from '../../lib/timelapse-file';

class TimelapseContainer extends Component {
  constructor(props) {
    super();
    this.state = {};
    this.chartSvgRef = null;
  }

  handleScreenshotClick = () => {
    if (!GameStore.svgEl) return;
    let source =
      '<?xml version="1.0" standalone="no"?>\n' + GameStore.svgEl.outerHTML;

    saveAs(
      new Blob([source], {
        type: 'image/svg+xml'
      }),
      `Screenshot ${GameStore.map.name}.svg`
    );
  };

  componentDidMount() {
    TimelapsePlaybackStore.on('change', this.reRender);
  }

  componentWillUnmount() {
    TimelapsePlaybackStore.removeListener('change', this.reRender);
  }

  reRender = () => this.setState({});

  share = async () => {
    try {
      const result = await shareOrDownloadTimelapse(
        TimelapsePlaybackStore.timelapse,
        this.props.name || TimelapseStore.defaultTimelapseName()
      );
      sendMessageInfo(
        result === 'shared'
          ? 'Timelapse shared.'
          : 'Timelapse exported to a file.'
      );
    } catch (error) {
      if (error.name !== 'AbortError') {
        sendMessageError('Unable to export the timelapse.');
        console.warn('Timelapse export failed.', error);
      }
    }
  };

  handleStartPlaying = () => {
    if (this.props.timelapseroute === 'current') {
      const result = confirm(
        'You have not saved your timelapse. Are you sure you want to continue?'
      );
      if (!result) return;
    }
    GameStore.startSaved(
      TimelapsePlaybackStore.states[
        Math.floor(TimelapsePlaybackStore.index)
      ]
    );
    route('/game');
  };

  handleSaveTimelapse = () => {
    const name = TimelapsePlaybackStore.save();
    if (!name) return;
    route('/timelapse/localstorage?key=' + name);
  };

  handleOverviewClick = () => {
    route('/timelapse/overview');
  };

  render() {
    return (
      <div className="TimelapseContainer">
        <div className="timelapse-back">
          <button onClick={this.handleOverviewClick}>Overview</button>
        </div>
        <div className="panel timelapse-header">
          <h3 className="text-center">{this.props.name}</h3>
          <p />
        </div>
        <FullscreenableTimelapseViewer />
        <div className="panel timelapse-footer">
          <div className="timelapse-footer-options">
            <div className="option" onClick={this.handleStartPlaying}>
              <FaPlayCircle /> Start playing timelapse at{' '}
              {gamestoreFramesTimeFmt(TimelapsePlaybackStore.index)}
            </div>
            <div className="option" onClick={this.share}>
              <FaShareAlt /> Share / Export this timelapse
            </div>
            {this.props.timelapseroute !== 'localstorage' ? (
              <div className="option" onClick={this.handleSaveTimelapse}>
                <FaSave /> Save Timelapse
              </div>
            ) : null}
            <div className="option" onClick={this.handleScreenshotClick}>
              <FaDesktop /> Save Radar as SVG
            </div>
          </div>
        </div>
        <div className="panel">
          <SavedGamesOpen />
        </div>
        <div className="panel">
          <TimelapseChart />
        </div>
      </div>
    );
  }
}

export default TimelapseContainer;
