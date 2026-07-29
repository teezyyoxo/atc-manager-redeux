import { Component } from 'preact';
import './AptDat.css';
import GroundAirportSvg from '../../components/GroundAirportSvg/GroundAirportSvg';

class AptDat extends Component {
  constructor(props) {
    super();
    this.state = {};
  }

  render() {
    return (
      <div className="AptDat">
        <div className="panel">
          <h1>Apt Dat</h1>

          <svg width="580" height="400" viewBox="0 0 400 400">
            <GroundAirportSvg />
          </svg>
        </div>
      </div>
    );
  }
}

export default AptDat;
