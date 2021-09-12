/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import MaterialTable from "material-table";

const dataUrl = 'https://leaderboard-serverless.vercel.app/api/raw_stats?orchestrator=';

const columns = [
  {
    title: 'Region',
    field: 'region',
  },
  {
    title: 'RealTime',
    field: 'isRealTime',
  },
  {
    title: 'Transcode Time',
    field: 'transcodeTime',
  },
  {
    title: 'Upload Time',
    field: 'uploadTime',
  },
  {
    title: 'Download Time',
    field: 'downloadTime',
  },
];
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
            const {
              region,
              timestamp,
              seg_duration,
              round_trip_time,
              orchestrator,
              segments_recieved,
              segments_sent,
              transcode_time,
              upload_time,
              download_time,
            } = record;
            const dateTime = new Date(timestamp).toLocaleTimeString('en-US');
            const isRealTime = seg_duration < round_trip_time ? 'yes' : 'no';
            const parsedRecord = {
              region,
              dateTime,
              isRealTime,
              orchestrator,
              roundTripTime: round_trip_time,
              segmentsRecieved: segments_recieved,
              segmentsSent: segments_sent,
              transcodeTime: transcode_time,
              uploadTime: upload_time,
              downloadTime: download_time,
            };
            statsList.push(parsedRecord);
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
          <MaterialTable title="Test Stream Stats"
            data={this.state.leaderboardStats} columns={columns}
            options={{}} />
        </div>
      </div>
    );
  }
}

statsTable.propTypes = {
  address: PropTypes.string,
};

export default statsTable;
