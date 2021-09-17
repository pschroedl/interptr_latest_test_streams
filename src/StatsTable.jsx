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
    title: 'Time',
    field: 'dateTime',
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
  {
    title: 'Round Trip Time',
    field: 'roundTripTime',
  },
  {
    title: 'Segment Duration',
    field: 'segmentDuration',
  },
  {
    title: 'Segments recieved',
    field: 'segmentsRecieved',
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
            const dateTime = new Date(timestamp * 1000).toLocaleString('en-US');
            const isRealTime = seg_duration > round_trip_time ? 'yes' : 'no';
            const parsedRecord = {
              region,
              dateTime,
              isRealTime,
              orchestrator,
              roundTripTime: round_trip_time.toFixed(2),
              segmentsRecieved: segments_recieved,
              segmentsSent: segments_sent,
              segmentDuration: seg_duration.toFixed(2),
              transcodeTime: transcode_time.toFixed(2),
              uploadTime: upload_time.toFixed(2),
              downloadTime: download_time.toFixed(2),
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
