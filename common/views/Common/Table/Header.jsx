import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ header, tooltip, sortMe }) => (
  <td title={tooltip || header}>
    <b>{header}</b>
    <i onClick={() => sortMe(header, true)} className="sort-icon fa fa-arrow-up" />
    <i onClick={() => sortMe(header, false)} className="sort-icon fa fa-arrow-down" />
  </td>
);

export default Header;

Header.propTypes = {
  header: PropTypes.string,
  sortMe: PropTypes.func,
  tooltip: PropTypes.string
};
