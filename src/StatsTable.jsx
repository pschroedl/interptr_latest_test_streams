/* eslint-disable camelcase */

import React from 'react';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';
import ArrowDownward from '@material-ui/icons/ArrowDownward';

const dataUrl = 'https://leaderboard-serverless.vercel.app/api/raw_stats?orchestrator=';

const tableIcons = {
  SortArrow: React.forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
};

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
    field: 'segmentsReceived',
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
        const statsList = [];
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
              segments_received,
              segments_sent,
              transcode_time,
              upload_time,
              download_time,
            } = record;
            const dateTime = new Date(timestamp * 1000).toLocaleString('en-US');
            const fast = seg_duration > round_trip_time;
            const success = transcode_time > 0;
            const isRealTime = fast && success ? 'Yes' : 'No';
            const parsedRecord = {
              region,
              dateTime,
              isRealTime,
              orchestrator,
              roundTripTime: round_trip_time.toFixed(2),
              segmentsReceived: segments_received,
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
        <div className="card-body">
          <MaterialTable title="LivePeer Test Stream Statistics"
            data={this.state.leaderboardStats} columns={columns}
            icons={tableIcons}
            options={{
              search: false,
              pageSize: this.state.leaderboardStats.length,
              paging: false,
              rowStyle: (rowData) => {
                let bg = '#FFF';
                if (rowData.transcodeTime === '0.00') {
                  bg = '#FF0000';
                }
                if (rowData.isRealTime === 'No') {
                  bg = '#EEE';
                }
                return ({
                  backgroundColor: bg,
                });
              },
            }} />
        </div>
      </div>
    );
  }
}

statsTable.propTypes = {
  address: PropTypes.string,
};

export default statsTable;
