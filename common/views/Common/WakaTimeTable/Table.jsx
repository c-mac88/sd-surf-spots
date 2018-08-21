import React from 'react';
import PropTypes from 'prop-types';
import Row from './Row';

const Table = ({ wakatimes }) => (
  <table className="table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Date</th>
        <th>Project</th>
        <th>Hours</th>
      </tr>
    </thead>
    <tbody>
      {wakatimes.map(wakatime => <Row key={`${wakatime.fullName}${wakatime.totalSeconds}${wakatime.date}`} wakatime={wakatime} />)}
    </tbody>
  </table>
);

export default Table;

Table.propTypes = {
  wakatimes: PropTypes.oneOfType([
    PropTypes.array
  ])
};
