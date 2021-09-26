import React from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import StatsTable from './StatsTable.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      orchAddress: '0x10e0A91E652b05e9C7449ff457Cf2E96C3037fB7',
      textFieldInput: '0x10e0A91E652b05e9C7449ff457Cf2E96C3037fB7',
    };
  }

  handleTextFieldChange(event) {
    event.preventDefault();
    this.setState({
      textFieldInput: event.target.value,
    });
  }

  setAddress(event) {
    event.preventDefault();
    this.setState({
      orchAddress: this.state.textFieldInput,
    });
  }

  render() {
    return (
      <div className="App">
        <div className="card text-center m-3" >
          <div className="card text-center m-3 inputHeader">
              <TextField id="filled-basic" className="addressField"
                label="Orchestrator Address"
                variant="filled"
                defaultValue="0x10e0A91E652b05e9C7449ff457Cf2E96C3037fB7"
                onChange={(e) => this.handleTextFieldChange(e)}>
                Enter Orch Addr:
              </TextField>
              <div className="addressButton">
                <Button variant="contained" onClick={(e) => this.setAddress(e)}>Lookup</Button>
              </div>
          </div>
          <StatsTable address={this.state.orchAddress}/>
        </div>
      </div>
    );
  }
}

export default App;
