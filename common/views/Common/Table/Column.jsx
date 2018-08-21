import React from 'react';
import PropTypes from 'prop-types';

const Column = ({ column }) => (
  <td>{column}</td>
);

export default Column;

Column.propTypes = {
  column: PropTypes.oneOfType([
    PropTypes.any
  ])
};
