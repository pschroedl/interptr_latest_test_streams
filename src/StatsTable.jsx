import React from 'react';
import PropTypes from 'prop-types';
import TranscodingStatsTable from './TranscodingStatsTable';
import AIStatsTable from './AIStatsTable';

class StatsTable extends React.Component {
  render() {
    if (this.props.aiJobs) {
      return <AIStatsTable {...this.props} />;
    } else {
      return <TranscodingStatsTable {...this.props} />;
    }
  }
}

StatsTable.propTypes = {
  address: PropTypes.string.isRequired,
  aiJobs: PropTypes.bool,
  pipeline: PropTypes.string,
  model: PropTypes.string,
};

export default StatsTable;
