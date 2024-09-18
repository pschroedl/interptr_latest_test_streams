/* eslint-disable camelcase */

import React from 'react';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';
import Tooltip from '@material-ui/core/Tooltip';
import ArrowDownward from '@material-ui/icons/ArrowDownward';

const dataUrl = process.env.REACT_APP_DATA_URL;

const tableIcons = {
  SortArrow: React.forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
};

const columns = [
  {
    title: 'Region',
    field: 'region',
    width: '50px',
  },
  {
    title: 'Time',
    field: 'dateTime',
    width: '100px',
  },
  {
    title: 'RealTime',
    field: 'isRealTime',
    width: '80px',
  },
  {
    title: 'Transcode Time',
    field: 'transcodeTime',
    width: '80px',
  },
  {
    title: 'Upload Time',
    field: 'uploadTime',
    width: '80px',
  },
  {
    title: 'Download Time',
    field: 'downloadTime',
    width: '80px',
  },
  {
    title: 'Roundtrip Time',
    field: 'roundTripTime',
    width: '80px',
  },
  {
    title: 'Segment Duration',
    field: 'segmentDuration',
    width: '80px',
  },
  {
    title: 'Segments Received',
    field: 'segmentsReceived',
    width: '80px',
    render: (rowData) => {
      let cell;
      if (rowData.segmentsReceived !== 60) {
        cell = <Tooltip title={rowData.error_json}>
          <span className="error">
            {rowData.segmentsReceived + '/60 !'}
          </span>
        </Tooltip>;
      } else {
        cell = rowData.segmentsReceived + '/60';
      }
      return cell;
    },
  },
];

class TranscodingStatsTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      leaderboardStats: [],
    };
    this.fetchData(this.props.address);
  }

  fetchData(address) {
    fetch(dataUrl + address)
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
              errors,
            } = record;
            let dateTime = new Date(timestamp * 1000).toLocaleString('en-US', { hour12: false });
            dateTime = dateTime.split(',').join('');
            const trans_time = (transcode_time === undefined ? 0.00 : transcode_time);
            const down_time = (download_time === undefined ? 0.00 : transcode_time);
            const up_time = (upload_time === undefined ? 0.00 : upload_time);
            const rt_time = (round_trip_time === undefined ? 0.00 : round_trip_time);
            const fast = seg_duration > round_trip_time;
            const success = trans_time > 0;
            const isRealTime = fast && success ? 'Yes' : 'No';
            const error_json = JSON.stringify(errors, undefined, 2);

            const parsedRecord = {
              region,
              dateTime,
              isRealTime,
              orchestrator,
              error_json,
              roundTripTime: rt_time.toFixed(2),
              segmentsReceived: segments_received,
              segmentsSent: segments_sent,
              segmentDuration: seg_duration.toFixed(2),
              transcodeTime: trans_time.toFixed(2),
              uploadTime: up_time.toFixed(2),
              downloadTime: down_time.toFixed(2),
            };
            statsList.push(parsedRecord);
          }
        }
        this.setState({ leaderboardStats: statsList });
      });
  }

  componentDidMount() {
    // Simple GET request using fetch
    this.fetchData(this.props.address);
  }

  componentDidUpdate(prevProps) {
    if (this.props.address !== prevProps.address) {
      this.fetchData(this.props.address);
    }
  }

  render() {
    return (
      <div className="card text-center m-3">
        <div className="card-body">
          <MaterialTable title="LivePeer Test Stream Statistics"
                         data={this.state.leaderboardStats} columns={columns}
                         icons={tableIcons}
                         options={{
                           showTitle: false,
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
                           tableLayout: 'fixed',
                         }} />
          <div className="hidden">{this.props.update}</div>
        </div>
      </div>
    );
  }
}

TranscodingStatsTable.propTypes = {
  address: PropTypes.string,
  update: PropTypes.number,
};

export default TranscodingStatsTable;
