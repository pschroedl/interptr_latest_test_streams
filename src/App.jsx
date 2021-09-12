import React from 'react';
import './App.css';
import StatsTable from './StatsTable.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      orchAddress: '0x10e0A91E652b05e9C7449ff457Cf2E96C3037fB7',
    };
  }

  render() {
    return (
      <div className="App">
        <StatsTable address={this.state.orchAddress}/>
      </div>
    );
  }
}

export default App;
