import React from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import StatsTable from './StatsTable.jsx';

function getParams(location) {
  const searchParams = new URLSearchParams(location.search);
  return searchParams.get('address') || '';
}

function setParams({ address = ''}) {
  const params = new URLSearchParams();
  params.set('address', address);
  window.history.replaceState({}, '', `${location.pathname}?${params}`);
  return params.toString();
}
class App extends React.Component {
  constructor(props) {
    super(props);

    const address = getParams(window.location);
    debugger;
    this.state = {
      // orchAddress: '0x10e0A91E652b05e9C7449ff457Cf2E96C3037fB7',
      orchAddress: address,
      textFieldInput: address,
      update: 0,
    };
  }

  handleTextFieldChange(event) {
    event.preventDefault();
    this.setState({
      textFieldInput: event.target.value,
    });
  }

  setAddress(event) {
    debugger;
    event.preventDefault();
    const address = this.state.textFieldInput;
    const update = this.state.update + 1;
    setParams({ address });
    this.setState({ orchAddress: address });  
    this.setState({ update });
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
        <div className="card text-center m-3" >
          <div className="card text-center m-3 inputHeader">
              <TextField id="filled-basic" className="addressField"
                label="Orchestrator Address"
                variant="filled"
                defaultValue="0x10e0A91E652b05e9C7449ff457Cf2E96C3037fB7"
                onChange={(e) => this.handleTextFieldChange(e)}
                onKeyPress={(e) => this.catchReturn(e)}>
                Enter Orch Addr:
              </TextField>
              <div className="addressButton">
                <Button variant="contained" onClick={(e) => this.setAddress(e)}>Lookup</Button>
              </div>
          </div>
          <StatsTable address={this.state.orchAddress} update={this.state.update}/>
        </div>
      </div>
    );
  }
}

export default App;
