import React from 'react';
import PropTypes from 'prop-types';

const dataUrl = 'https://leaderboard-serverless.vercel.app/api/raw_stats?orchestrator=';

const Listitem = ({stat}) => {
  return (
    <li key={stat.timestamp}>{stat.region}</li>
  );
};

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
            statsList.push(record);
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
          <ul>
            {this.state.leaderboardStats.map((stat) => <Listitem key={stat.timestamp} stat={stat}></Listitem>)}
          </ul>
        </div>
      </div>
    );
  }
}

statsTable.propTypes = {
  address: PropTypes.string,
};

export default statsTable;
