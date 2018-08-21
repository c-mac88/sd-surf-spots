import React from 'react';
import PropTypes from 'prop-types';
import Column from './Column';

const Row = ({ row }) => (
  <tr>
    {Object.values(row).map((column, key) => <Column key={key} column={column} />)}
  </tr>
);

export default Row;

Row.propTypes = {
  row: PropTypes.oneOfType([
    PropTypes.object
  ])
};
