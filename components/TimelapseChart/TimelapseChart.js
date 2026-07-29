import { Component } from 'preact';
import './TimelapseChart.css';
import TimelapsePlaybackStore from '../../stores/TimelapsePlaybackStore';

const width = 580;
const height = 400;
const padding = { top: 20, right: 20, bottom: 55, left: 45 };
const plotWidth = width - padding.left - padding.right;
const plotHeight = height - padding.top - padding.bottom;
const metrics = [
  { key: 'distanceVialations', label: 'Separation conflicts', color: '#ff5a5a' },
  { key: 'enroutes', label: 'Enroute flights', color: '#55aaff' },
  { key: 'departures', label: 'Departed flights', color: '#6574ff' },
  {
    key: 'unpermittedDepartures',
    label: 'Unpermitted departures',
    color: '#ffae42'
  },
  { key: 'arrivals', label: 'Arrived flights', color: '#c878ff' }
];

class TimelapseChart extends Component {
  constructor(props) {
    super();
    this.state = {};
  }

  componentDidMount() {
    TimelapsePlaybackStore.on(
      'change',
      this.handleTimelapsePlaybackStoreChange
    );
  }

  componentWillUnmount() {
    TimelapsePlaybackStore.removeListener(
      'change',
      this.handleTimelapsePlaybackStoreChange
    );
  }

  handleTimelapsePlaybackStoreChange = () => this.setState({});

  render() {
    const data = TimelapsePlaybackStore.chart || [];
    if (data.length === 0) {
      return <div className="TimelapseChart empty">No chart data available.</div>;
    }

    const keys = metrics.map(metric => metric.key).concat('trafficLength');
    const maxValue = Math.max(
      1,
      ...data.map(item =>
        Math.max(...keys.map(key => Number(item[key]) || 0))
      )
    );
    const x = index =>
      padding.left +
      (data.length === 1 ? 0 : (index / (data.length - 1)) * plotWidth);
    const y = value =>
      padding.top + plotHeight - ((Number(value) || 0) / maxValue) * plotHeight;
    const pointsFor = key =>
      data.map((item, index) => `${x(index)},${y(item[key])}`).join(' ');
    const trafficArea = [
      `${padding.left},${padding.top + plotHeight}`,
      pointsFor('trafficLength'),
      `${padding.left + plotWidth},${padding.top + plotHeight}`
    ].join(' ');
    const ticks = [0, 0.25, 0.5, 0.75, 1];

    return (
      <div className="TimelapseChart">
        <svg
          role="img"
          aria-label="Timelapse traffic and event chart"
          viewBox={`0 0 ${width} ${height}`}
        >
          {ticks.map(tick => {
            const tickY = padding.top + plotHeight * (1 - tick);
            return (
              <g key={tick}>
                <line
                  className="chart-grid"
                  x1={padding.left}
                  x2={padding.left + plotWidth}
                  y1={tickY}
                  y2={tickY}
                />
                <text
                  className="chart-tick"
                  x={padding.left - 8}
                  y={tickY + 4}
                >
                  {Math.round(maxValue * tick)}
                </text>
              </g>
            );
          })}
          <polygon className="traffic-area" points={trafficArea}>
            <title>Traffic load</title>
          </polygon>
          {metrics.map(metric => (
            <polyline
              key={metric.key}
              className="chart-line"
              points={pointsFor(metric.key)}
              stroke={metric.color}
            >
              <title>{metric.label}</title>
            </polyline>
          ))}
          <g className="chart-legend">
            {metrics.concat({
              key: 'trafficLength',
              label: 'Traffic load',
              color: '#62c67a'
            }).map((metric, index) => {
              const legendX = padding.left + (index % 3) * 175;
              const legendY = height - 32 + Math.floor(index / 3) * 20;
              return (
                <g key={metric.key}>
                  <line
                    x1={legendX}
                    x2={legendX + 18}
                    y1={legendY}
                    y2={legendY}
                    stroke={metric.color}
                    strokeWidth="3"
                  />
                  <text x={legendX + 24} y={legendY + 4}>
                    {metric.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    );
  }
}

export default TimelapseChart;
