/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';

const dataUrl = 'https://leaderboard-serverless.vercel.app/api/raw_stats?orchestrator=';

const ListItem = ({ stat }) => {
  const {
    region,
    timestamp,
    seg_duration,
    round_trip_time,
    orchestrator,
    segments_recieved,
    segments_sent,
    transcode_time,
    upload_time
  } = stat;
  const dateTime = new Date(timestamp).toLocaleTimeString('en-US');
  const isRealTime = seg_duration < round_trip_time ? "yes" : "no"

  return (
    <li key={timestamp}>
      <div>region: {region}</div>
      <div>is realtime?: {isRealTime}</div>
    </li>
  );
};

ListItem.propTypes = {
  stat: {
    region: PropTypes.string,
    timestamp: PropTypes.number,
    seg_duration: PropTypes.number,
    round_trip_time: PropTypes.number,
    orchestrator: PropTypes.string,
    segments_recieved: PropTypes.number,
    segments_sent: PropTypes.number,
    transcode_time: PropTypes.number,
    upload_time: PropTypes.number,
  },
};
class statsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: props.address,
      leaderboardStats: [],
    };
  }

  componentDidMount() {
    // Simple GET request using fetch
    fetch(dataUrl + this.props.address)
      .then((response) => response.json())
      .then((data) => {
        let statsList = [];
        // eslint-disable-next-line
        for (const [, value] of Object.entries(data)) {
          // eslint-disable-next-line
          for (const record of value) {
            statsList.push(record);
          }
        }
        this.setState({ leaderboardStats: statsList });
      });
  }

  render() {
    return (
      <div className="card text-center m-3">
        <h5 className="card-header">Test Streams</h5>
        <div className="card-body">
          <ul>
            {this.state.leaderboardStats.map((stat) => (
              <ListItem key={stat.timestamp} stat={stat}></ListItem>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

statsTable.propTypes = {
  address: PropTypes.string,
};

export default statsTable;
