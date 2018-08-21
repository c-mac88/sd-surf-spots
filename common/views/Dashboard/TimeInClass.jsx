import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import FilterButton from './FilterButton';
import BarChart from '../Common/Charts/Bar';
import ColorArray from '../Common/ColorArray';

export default class TimeInClass extends Component {
  constructor(props) {
    super(props);
    this.handleSelectRange = this.handleSelectRange.bind(this);
    this.state = {
      chartData: {},
      totalSecondsToDate: 0,
      timeSpentInClass: props.timeSpentInClass
    };
  }

  componentDidMount() {
    this.handleSelectRange('week');
  }

  async getChartData(formattedTimeSpentInClass, range) {
    const chartData = {
      labels: [],
      datasets: [
        {
          label: 'Hours In Class',
          data: [],
          backgroundColor: ColorArray
        }
      ]
    };
    await formattedTimeSpentInClass.forEach((statement) => {
      const preFormattedDate = new Date(statement.date).toISOString();
      const formattedDate = moment(preFormattedDate).format('llll');
      chartData.labels.push(formattedDate.substring(0, formattedDate.indexOf('201') - 2));
      const duration = moment(statement.end, "hh:mm:ss A").diff(moment(statement.start, "hh:mm:ss A"), 'hours', true);
      chartData.datasets[0].data.push(duration.toFixed(2));
    });
    let totalSecondsToDate = 0;
    for (let i = 0; i < formattedTimeSpentInClass.length; i++) {
      const duration = moment(formattedTimeSpentInClass[i].end, "hh:mm:ss A").diff(moment(formattedTimeSpentInClass[i].start, "hh:mm:ss A"), 'hours', true);
      totalSecondsToDate += duration;
    }
    this.setState({ chartData, totalSecondsToDate, range });
  }

  async filterByRange(range) {
    const { timeSpentInClass } = this.state;
    let filteredTimeSpentInClass;
    return new Promise((resolve) => {
      switch (range) {
        case 'all': {
          filteredTimeSpentInClass = timeSpentInClass;
          break;
        }
        case 'week': {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          filteredTimeSpentInClass = timeSpentInClass.filter(x => new Date(x.date) > oneWeekAgo);
          break;
        }
        case 'month': {
          const lastMonth = new Date();
          lastMonth.setDate(lastMonth.getDate() - 30);
          filteredTimeSpentInClass = timeSpentInClass.filter(x => new Date(x.date) > lastMonth);
          break;
        }
        default:
          break;
      }
      resolve(filteredTimeSpentInClass);
    });
  }

  async handleSelectRange(range) {
    const filteredTimeSpentInClass = await this.filterByRange(range);
    const formattedTimeSpentInClass = filteredTimeSpentInClass.sort((a, b) => {
      const keyA = (new Date(a.date));
      const keyB = (new Date(b.date));
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });
    this.getChartData(formattedTimeSpentInClass, range);
  }

  render() {
    const { chartData, totalSecondsToDate } = this.state;
    const options = {
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          ticks: {
            fontSize: 16
          }
        }],
        xAxes: [{
          ticks: {
            fontSize: 16
          }
        }]
      }
    };
    return (
      <div className="row">
        <div className="chart-container-parent col col-xs-12">
          <h2>You have spent {totalSecondsToDate.toFixed(2)} hours in class</h2>
          <FilterButton handleClickRange={this.handleSelectRange} className={this.state.range === 'week' ? 'btn btn-success' : 'btn btn-clear'} range="week" buttonName="One week" />
          <FilterButton handleClickRange={this.handleSelectRange} className={this.state.range === 'month' ? 'btn btn-success' : 'btn btn-clear'} range="month" buttonName="30 days" />
          <FilterButton handleClickRange={this.handleSelectRange} className={this.state.range === 'all' ? 'btn btn-success' : 'btn btn-clear'} range="all" buttonName="All time" />
          <div className="chart-container">
            {chartData && <BarChart data={chartData} options={options} />}
          </div>
        </div>
      </div>
    );
  }
}

TimeInClass.propTypes = {
  timeSpentInClass: PropTypes.arrayOf(PropTypes.any)
};
