import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Row from './Row';

/**
 * Reusable table component. Pass it a single array of objects as a prop called tableData.
 * e.g. <Table tableData={myArray} />
 * Note: Nested objects will not display properly.
 */
export default class Table extends React.Component {
  constructor(props) {
    super(props);
    const { tableData, tooltips } = this.props;
    this.state = {
      tableData,
      tooltips
    };
    this.sortMe = this.sortMe.bind(this);
  }

  /**
   * Sort the array based on the property and order selected by the user
   * @param {string} property Name of object property in the array
   * @param {boolean} asc sort asc if true, desc if false
   */
  sortMe(property, asc) {
    let isDate = false;
    const testProperty = this.state.tableData[0][property];
    if (testProperty.length > 2 && Date.parse(testProperty) > 0) isDate = true;
    const tableData = [...this.state.tableData].sort((a, b) => {
      const keyA = isDate ? Date.parse(a[property]) : a[property];
      const keyB = isDate ? Date.parse(b[property]) : b[property];
      if (keyA < keyB) return asc ? -1 : 1;
      if (keyA > keyB) return asc ? 1 : -1;
      return 0;
    });
    this.setState({ tableData });
  }

  render() {
    const { tableData, tooltips } = this.state;
    return (<table className="table">
      <thead>
        <tr>
          {Object.keys(tableData[0]).map((header, index) => <Header key={header} header={header} sortMe={this.sortMe} tooltip={tooltips[index]} />)}
        </tr>
      </thead>
      <tbody>
        {tableData.map((row, key) => <Row key={key} row={row} />)}
      </tbody>
    </table>
    );
  }
}

Table.propTypes = {
  tableData: PropTypes.arrayOf(PropTypes.any),
  tooltips: PropTypes.arrayOf(PropTypes.any)
};
