import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import { connect } from 'react-redux';

import Navbar from '../Navbar/NavbarPage';
import DashboardPage from '../Dashboard/DashboardPage';
import TimeClockDisplayPage from '../TimeClockDisplay/TimeClockDisplayPage';

class App extends Component {
  handleLogout() {
    const { user } = this.props;
    this.props.dispatch(logout(user));
  }

  render() {
    return (
      <Router>
        <div>
          <Navbar />
          <Switch>
            <Route exact path="/" component={DashboardPage} />
            <Route path="/timeClockDisplay" component={TimeClockDisplayPage} />
          </Switch>
        </div>
      </Router>
    );
  }
}

App.propTypes = {
  user: PropTypes.object,
  dispatch: PropTypes.func.isRequired
};

App.contextTypes = {
  store: PropTypes.object.isRequired
};

function mapStateToProps(store) {
  return {
    user: store.user
  };
}

export default connect(mapStateToProps)(App);

/*

    <PrivateRoute
      path="/users"
      isAuthenticated={isAuthenticated}
      component={UsersPage}
    />

*/
