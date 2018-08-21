import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import LineChart from '../Common/Charts/Line';
import BarChart from '../Common/Charts/Bar';
import FilterButton from './FilterButton';
import colorArray from '../Common/ColorArray';

export default class TimeCoding extends Component {
  constructor(props) {
    super(props);
    this.handleSelectRange = this.handleSelectRange.bind(this);
    this.state = {
      chartDataHours: {},
      chartDataProjects: {},
      totalSecondsToDate: 0,
      timeSpentCoding: props.timeSpentCoding
    };
  }

  componentDidMount() {
    this.handleSelectRange('week');
  }

  async getProjectBreakdown(formattedTimeSpentCoding) {
    const projects = {};
    for (let i = 0; i < formattedTimeSpentCoding.length; i++) {
      let projectName = formattedTimeSpentCoding[i].name;
      // strip startnow-xxxxxx- from beginning of project name
      if (projectName.substring(0, 8) === 'startnow') {
        if (projectName.indexOf('0-') >= 0) {
          projectName = projectName.substring(projectName.indexOf('0-') + 2, projectName.length);
        } else {
          projectName = projectName.substring(projectName.indexOf('1-') + 2, projectName.length);
        }
      }
      if (!projects[projectName]) {
        projects[projectName] = [];
      }
      projects[projectName].push(formattedTimeSpentCoding[i].totalSeconds);
    }
    formattedTimeSpentCoding = [];
    for (const projectName in projects) {
      formattedTimeSpentCoding.push({
        name: projectName.substring(projectName),
        total: projects[projectName]
      });
    }
    return formattedTimeSpentCoding;
  }

  async getChartData(formattedTimeSpentCoding, range) {
    const chartDataHours = {
      labels: [],
      datasets: [
        {
          label: 'Hours Spent Coding',
          data: [],
          backgroundColor: 'rgb(100,171,221)'
        }
      ]
    };
    const chartDataProjects = {
      labels: [],
      datasets: [
        {
          label: 'Project Hours',
          data: [],
          backgroundColor: colorArray
        }
      ]
    };
    await formattedTimeSpentCoding.forEach((statement) => {
      const formattedDate = moment(statement.date).format('llll');
      chartDataHours.labels.push(formattedDate.substring(0, formattedDate.indexOf('201') - 2));
      chartDataHours.datasets[0].data.push((statement.totalSeconds / 60 / 60).toFixed(2));
    });
    // NEED TO SEPARATE THE MAIN LIST TO AN ARRAY OF OBECTS WITH JUST THE PROJECTS
    const onlyProjects = [];
    await formattedTimeSpentCoding.forEach((statement) => {
      const projects = statement.projects;
      for (let i = 0; i < projects.length; i++) {
        onlyProjects.push(projects[i]);
      }
    });
    const projects = await this.getProjectBreakdown(onlyProjects);
    await projects.forEach((project) => {
      chartDataProjects.labels.push(project.name);
      chartDataProjects.datasets[0].data.push((project.total.reduce((a, b) => a + b, 0) / 60 / 60).toFixed(2));
    });
    let totalSecondsToDate = 0;
    for (let i = 0; i < formattedTimeSpentCoding.length; i++) {
      totalSecondsToDate += formattedTimeSpentCoding[i].totalSeconds;
    }
    this.setState({ chartDataHours, chartDataProjects, totalSecondsToDate, range });
  }

  async filterByRange(range) {
    const { timeSpentCoding } = this.props;
    let filteredTimeSpentCoding;
    return new Promise((resolve) => { 
      switch (range) {
        case 'all': {
          filteredTimeSpentCoding = timeSpentCoding;
          break;
        }
        case 'week': {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          filteredTimeSpentCoding = timeSpentCoding.filter(x => new Date(x.date) > oneWeekAgo);
          break;
        }
        case 'month': {
          const lastMonth = new Date();
          lastMonth.setDate(lastMonth.getDate() - 30);
          filteredTimeSpentCoding = timeSpentCoding.filter(x => new Date(x.date) > lastMonth);
          break;
        }
        default:
          break;
      }
      resolve(filteredTimeSpentCoding);
    });
  }

  async handleSelectRange(range) {
    const filteredTimeSpentCoding = await this.filterByRange(range);
    const formattedTimeSpentCoding = filteredTimeSpentCoding.sort((a, b) => {
      const keyA = (new Date(a.date));
      const keyB = (new Date(b.date));
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });
    this.getChartData(formattedTimeSpentCoding, range);
  }

  render() {
    const { totalSecondsToDate, chartDataHours, chartDataProjects } = this.state;
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
          <h2>You have spent {(totalSecondsToDate / 60 / 60).toFixed(2)} hours coding</h2>
          <FilterButton handleClickRange={this.handleSelectRange} className={this.state.range === 'week' ? 'btn btn-success' : 'btn btn-clear'} range="week" buttonName="One week" />
          <FilterButton handleClickRange={this.handleSelectRange} className={this.state.range === 'month' ? 'btn btn-success' : 'btn btn-clear'} range="month" buttonName="30 days" />
          <FilterButton handleClickRange={this.handleSelectRange} className={this.state.range === 'all' ? 'btn btn-success' : 'btn btn-clear'} range="all" buttonName="All time" />
          <div className="chart-container">
            {chartDataHours && <LineChart data={chartDataHours} options={options} />}
          </div>
          <div className="chart-container">
            {chartDataProjects && <BarChart data={chartDataProjects} options={options} />}
          </div>
        </div>
      </div>
    );
  }
}

TimeCoding.propTypes = {
  timeSpentCoding: PropTypes.arrayOf(PropTypes.any)
};
