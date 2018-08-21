import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FilterButton extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.props.handleClickRange(this.props.range);
  }

  render() {
    return (<button className={this.props.className} onClick={this.handleClick}>{this.props.buttonName}</button>);
  }
}

export default FilterButton;

FilterButton.propTypes = {
  handleClickRange: PropTypes.func,
  range: PropTypes.string,
  buttonName: PropTypes.string,
  className: PropTypes.string
};
