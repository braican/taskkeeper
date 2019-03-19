import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './SidebarTrigger.scss';

const SidebarTrigger = ({ toggleSidebar }) => {
  return (
    <button className="SidebarTrigger" onClick={() => toggleSidebar()}>
      <span />
      Clients
    </button>
  );
};

SidebarTrigger.propTypes = {
  toggleSidebar: PropTypes.func,
};

const mapDispatchToProps = dispatch => ({
  toggleSidebar: isOpen => dispatch({ type: 'TOGGLE_CLIENT_SIDEBAR', isOpen }),
});

export default compose(
  connect(
    null,
    mapDispatchToProps,
  ),
)(SidebarTrigger);
