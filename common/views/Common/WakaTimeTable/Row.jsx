import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const Row = ({ wakatime }) => (
  <tr>
    <td>{wakatime.fullName}</td>
    <td>{moment(wakatime.date).format('ddd, MMM D')}</td>
    <td>{wakatime.projects.map(project =>
      <tr key={`${wakatime.fullName}${project.name}`}>
        <td style={{ paddingRight: '2em' }}>{project.name}</td>
        <td>{Number((project.totalSeconds / 60 / 60).toFixed(2))}</td>
      </tr>
    )}</td>
    <td>{Number((wakatime.totalSeconds / 60 / 60).toFixed(2))}</td>
  </tr>

);

export default Row;

Row.propTypes = {
  wakatime: PropTypes.objectOf(PropTypes.any)
};
