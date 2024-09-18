/* eslint-disable camelcase */

import React from 'react';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';
import Tooltip from '@material-ui/core/Tooltip';
import ArrowDownward from '@material-ui/icons/ArrowDownward';

const aiJobsDataUrl = process.env.REACT_APP_AI_JOBS_DATA_URL;

const tableIcons = {
  SortArrow: React.forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
};

// Define columns for AI Jobs without Model and Pipeline
const columnsAIJobs = [
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
    title: 'Test Passed',
    field: 'successRate',
    width: '50px',
    render: (rowData) => {
      let errors = JSON.stringify(rowData.errors, null, 2); // Format JSON with indentation
      return (
        <Tooltip
          title={
            <div style={{ whiteSpace: 'normal', maxWidth: '300px', wordWrap: 'break-word' }}>
              {errors}
            </div>
          }
          arrow
        >
          <span>{rowData.successRate}</span>
        </Tooltip>
      );
    },
  },
  {
    title: 'Roundtrip Time',
    field: 'roundTripTime',
    width: '40px',
  },
  {
    title: 'Model',
    field: 'model',
    width: '150px',
  },
  {
    title: 'Model Warm',
    field: 'isModelWarm',
    width: '50px',
  },
  {
    title: 'Input Parameters',
    field: 'inputParameters',
    width: '50px',
    render: (rowData) => {
      let formattedInput;
      try {
        formattedInput = JSON.stringify(JSON.parse(rowData.inputParameters), null, 2);
      } catch (e) {
        formattedInput = rowData.inputParameters;
      }
      return (
        <Tooltip title={<pre>{formattedInput}</pre>} arrow>
          <span>view</span>
        </Tooltip>
      );
    },
  },
  {
    title: 'Response Payload',
    field: 'responsePayload',
    width: '60px',
    render: (rowData) => {
      let formattedResponse = "No Response";
      if(rowData.responsePayload !== undefined){
        try {
          formattedResponse = JSON.stringify(JSON.parse(rowData.responsePayload), null, 2);
        } catch (e) {
          formattedResponse = rowData.responsePayload;
        }
      }
      return (
        <Tooltip title={<pre>{formattedResponse}</pre>} arrow>
          <span>view</span>
        </Tooltip>
      );
    },
  },
];

class AIStatsTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      leaderboardStats: [],
    };
  }

  fetchData(props) {
    // Construct URL with orchestrator, pipeline, and model parameters
    const params = new URLSearchParams();
    params.set('orchestrator', props.address);
    if (props.pipeline) {
      params.set('pipeline', props.pipeline);
    }
    if (props.model) {
      params.set('model', props.model);
    }
    const url = aiJobsDataUrl + params.toString();

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const statsList = [];
        // Data is an object with regions as keys
        for (const [region, records] of Object.entries(data)) {
          for (const record of records) {
            const {
              errors,
              region,
              timestamp,
              round_trip_time,
              model,
              model_is_warm,
              success_rate,
              input_parameters,
              response_payload,
            } = record;
            let dateTime = new Date(timestamp * 1000).toLocaleString('en-US', { hour12: false });
            dateTime = dateTime.split(',').join('');
            const parsedRecord = {
              region,
              dateTime,
              roundTripTime: round_trip_time.toFixed(2),
              successRate: (success_rate === 1 ? "Yes" : "No"),
              model,
              isModelWarm: (model_is_warm === true ? "Yes" : "No"),
              inputParameters: input_parameters,
              responsePayload: response_payload,
              errors,
            };
            statsList.push(parsedRecord);
          }
        }
        this.setState({ leaderboardStats: statsList });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        this.setState({ leaderboardStats: [] });
      });
  }

  componentDidMount() {
    this.fetchData(this.props);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.address !== prevProps.address ||
      this.props.pipeline !== prevProps.pipeline ||
      this.props.model !== prevProps.model
    ) {
      this.fetchData(this.props);
    }
  }

  render() {
    return (
      <div className="card text-center m-3">
        <div className="card-body">
          <MaterialTable
            title="LivePeer AI Jobs Statistics"
            data={this.state.leaderboardStats}
            columns={columnsAIJobs}
            icons={tableIcons}
            options={{
              showTitle: false,
              search: false,
              pageSize: this.state.leaderboardStats.length,
              paging: false,
              rowStyle: (rowData) => {
                let bg = '#FFF';
                if (rowData.successRate === "No") {
                  bg = '#EEE';
                }
                return {
                  backgroundColor: bg,
                };
              },
              tableLayout: 'fixed',
            }}
          />
        </div>
      </div>
    );
  }
}

AIStatsTable.propTypes = {
  address: PropTypes.string.isRequired,
  pipeline: PropTypes.string,
  model: PropTypes.string,
};

export default AIStatsTable;
