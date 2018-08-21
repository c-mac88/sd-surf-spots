import React from 'react';
import PropTypes from 'prop-types';

class Row extends React.Component {
  constructor(props) {
    super(props);
    this.props = props
  }

  render() {
    const { time } = this.props
    const checkin = Object.prototype.toString.call(time.checkIn) === '[object Date]' ? time.checkIn.toLocaleTimeString() : 'None'
    const checkout = Object.prototype.toString.call(time.checkOut) === '[object Date]' ? time.checkOut.toLocaleTimeString() : 'None'
    const date = time == {} ? 'Test' : time.date.toDateString()
    const onSchedule = time == {} ? 'Test' : time.onSchedule
    const rowStyle  = {
      fontSize: '25px',
      textAlign: 'center',
      color: 'black',
      backgroundColor: time.onSchedule == 'YES' ? '#8BC670' : '#FF566F'
  };
    return (
      <tr>
        <td >{date}</td>
        <td>{checkin}</td>
        <td>{checkout}</td>
        <td style={rowStyle}> {onSchedule} </td>
      </tr>
    )
  }
}

export default Row;

Row.propTypes = {
  time: PropTypes.objectOf(PropTypes.any)
};
