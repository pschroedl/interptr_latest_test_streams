import React from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import StatsTable from './StatsTable.jsx';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const PIPELINES_URL = process.env.REACT_APP_PIPELINES_URL;

function getParams(location) {
  const searchParams = new URLSearchParams(location.search);
  return {
    address: searchParams.get('address') || '',
    pipeline: searchParams.get('pipeline') || '',
    model: searchParams.get('model') || '',
    aiJobs: searchParams.get('aiJobs') === 'true', // Parse boolean value
  };
}

function setParams({ address = '', pipeline = '', model = '', aiJobs = false }) {
  const params = new URLSearchParams();
  params.set('address', address);
  params.set('pipeline', pipeline);
  params.set('model', model);
  params.set('aiJobs', aiJobs);
  window.history.pushState({}, '', `${location.pathname}?${params}`);
  return params.toString();
}

class App extends React.Component {
  constructor(props) {
    super(props);

    const params = getParams(window.location);
    const address = params.address;
    const pipeline = params.pipeline;
    const model = params.model;
    const aiJobs = params.aiJobs; // Default is false if not specified

    this.state = {
      orchAddress: address,
      pipeline,
      model,
      aiJobs,
      textFieldInput: address,
      pipelineOptions: [],
      modelOptions: [],
      pipelinesData: {}, // To store the fetched pipelines data
    };

    // Bind event handlers
    this.handlePipelineChange = this.handlePipelineChange.bind(this);
    this.handleModelChange = this.handleModelChange.bind(this);
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handleAiJobsChange = this.handleAiJobsChange.bind(this);
    this.setAddress = this.setAddress.bind(this);
    this.catchReturn = this.catchReturn.bind(this);
    this.handlePopState = this.handlePopState.bind(this);
  }

  componentDidMount() {
    // Fetch pipeline data from the given URL
    fetch(PIPELINES_URL)
      .then((response) => response.json())
      .then((data) => {
        const pipelineOptions = data.pipelines.map((pipeline) => pipeline.id);
        const pipelinesData = {};
        data.pipelines.forEach((pipeline) => {
          pipelinesData[pipeline.id] = pipeline.models;
        });

        this.setState({ pipelineOptions, pipelinesData }, () => {
          // If a pipeline is already selected, set the model options accordingly
          if (this.state.pipeline) {
            const modelOptions = pipelinesData[this.state.pipeline] || [];
            this.setState({ modelOptions });
          }
        });
      })
      .catch((error) => {
        console.error('Error fetching pipeline data:', error);
      });
    window.addEventListener('popstate', this.handlePopState);
  }

  componentWillUnmount() {
    // Clean up event listener when the component is unmounted
    window.removeEventListener('popstate', this.handlePopState);
  }

  handlePopState() {
    // Update state based on URL parameters when the user navigates back or forward
    const params = getParams(window.location);
    this.setState({
      orchAddress: params.address,
      pipeline: params.pipeline,
      model: params.model,
      aiJobs: params.aiJobs,
      textFieldInput: params.address,
    }, () => {
      // Optionally, update model options when the pipeline changes
      if (params.pipeline) {
        const modelOptions = this.state.pipelinesData[params.pipeline] || [];
        this.setState({ modelOptions });
      }
    });
  }

  handleTextFieldChange(event) {
    event.preventDefault();
    this.setState({
      orchAddress: event.target.value,
      textFieldInput: event.target.value,
    });
  }

  setAddress(event) {
    event.preventDefault();
    const address = this.state.textFieldInput;
    setParams({
      address,
      pipeline: this.state.pipeline,
      model: this.state.model,
      aiJobs: this.state.aiJobs,
    });
    this.setState({ orchAddress: address });
  }

  handlePipelineChange(event) {
    const pipeline = event.target.value;
    let modelOptions = [];
    let model = '';
    modelOptions = this.state.pipelinesData[pipeline] || [];

    this.setState({ pipeline, modelOptions, model }); // Reset model when pipeline changes
    setParams({
      address: this.state.orchAddress,
      pipeline,
      model,
      aiJobs: this.state.aiJobs
    });
  }

  handleModelChange(event) {
    const model = event.target.value;
    this.setState({ model });
    setParams({
      address: this.state.orchAddress,
      pipeline: this.state.pipeline,
      model,
      aiJobs: this.state.aiJobs,
    });
  }

  handleAiJobsChange(event) {
    const aiJobs = event.target.checked;
    this.setState({ aiJobs });
    setParams({
      address: this.state.orchAddress,
      pipeline: this.state.pipeline,
      model: this.state.model,
      aiJobs,
    });
  }

  catchReturn(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.setAddress(event);
    }
  }

  render() {
    return (
      <div className="App">
        <div className="card text-center m-3">
          <div className="card text-center m-3 inputHeader">
            {/* Use Flexbox to arrange items horizontally */}
            <div className="form-row" style={{ display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.aiJobs}
                    onChange={this.handleAiJobsChange}
                    name="aiJobs"
                    color="primary"
                  />
                }
                label="AI Jobs"
                style={{ marginRight: '10px' }}
              />
              <TextField
                id="filled-basic"
                className="addressField"
                label="Orchestrator Address"
                variant="filled"
                value={this.state.orchAddress}
                onChange={this.handleTextFieldChange}
                onKeyPress={this.catchReturn}
                style={{ flex: 1, marginRight: '10px' }}
              />
              <div className="addressButton">
                <Button variant="contained" onClick={this.setAddress}>
                  Lookup
                </Button>
              </div>
            </div>
          </div>

          {/* Render pipeline and model dropdowns with padding */}
          {this.state.aiJobs && (
            <div className="card text-center m-3 inputHeader">
              <div className="dropdown-container" style={{ display: 'flex', alignItems: 'center' }}>
                <FormControl
                  variant="filled"
                  className="addressField"
                  style={{ marginRight: '10px' }}
                >
                  <InputLabel id="pipeline-select-label">Pipeline</InputLabel>
                  <Select
                    labelId="pipeline-select-label"
                    id="pipeline-select"
                    value={this.state.pipeline}
                    onChange={this.handlePipelineChange}
                  >
                    {this.state.pipelineOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {this.state.pipeline && (
                  <FormControl variant="filled" className="addressField">
                    <InputLabel id="model-select-label">Model</InputLabel>
                    <Select
                      labelId="model-select-label"
                      id="model-select"
                      value={this.state.model}
                      onChange={this.handleModelChange}
                    >
                      {this.state.modelOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </div>
            </div>
          )}
          <StatsTable
            address={this.state.orchAddress}
            aiJobs={this.state.aiJobs}
            pipeline={this.state.pipeline}
            model={this.state.model}
          />
        </div>
      </div>
    );
  }
}

export default App;
