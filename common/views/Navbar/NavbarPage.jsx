import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Navbar from './Navbar';
import * as NavbarActions from './actions';

function mapStateToProps(store) {
  return {
    user: store.user
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...NavbarActions, push }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
