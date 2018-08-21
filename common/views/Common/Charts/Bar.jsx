import React from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';

export default function Chart({ data, options, height, width }) {
  return (
    <Bar
      data={data}
      options={options}
      height={height}
      wisth={width}
    />
  );
}

Chart.propTypes = {
  options: PropTypes.objectOf(PropTypes.any),
  data: PropTypes.objectOf(PropTypes.any),
  height: PropTypes.number,
  width: PropTypes.number
};
