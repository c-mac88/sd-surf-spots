import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

class renderDatePicker extends React.Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(date) {
    const { dateFormat } = this.props;
    this.props.input.onChange(moment(date).format(dateFormat));
  }

  render() {
    const {
      input,
      dateFormat,
      meta: { touched, error }
    } = this.props;

    return (
      <div>
        <DatePicker
          placeHolder={new Date()}
          dateFormat={dateFormat}
          selected={input.value ? moment(input.value, dateFormat) : null}
          onChange={this.handleChange}
        />
        {touched && error && <span>{error}</span>}
      </div>
    );
  }
}

export default renderDatePicker;

renderDatePicker.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.objectOf(PropTypes.any),
  dateFormat: PropTypes.string
};
