import React from 'react';
import './App.css';

const dataUrl = 'https://leaderboard-serverless.vercel.app/api/raw_stats?orchestrator=0x10e0A91E652b05e9C7449ff457Cf2E96C3037fB7';

class GetRequest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      leaderboardStats: [],
    };
  }

  componentDidMount() {
    // Simple GET request using fetch
    fetch(dataUrl)
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
    // const { leaderboardStats } = this.state;
    return (
      <div className="card text-center m-3">
        <h5 className="card-header">Test Streams</h5>
        <div className="card-body">
          <ul>
            {this.state.leaderboardStats.map((stat) => <div key={stat.timestamp}>{stat.region}</div>)}
          </ul>

        </div>
      </div>
    );
  }
}

const App = () => (
  <div className="App">
    <GetRequest />
  </div>
);

export default App;
