import React from 'react';
import PropTypes from 'prop-types';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import * as actionCreators from '../../actions/actionCreators';

class App extends React.Component {
    constructor() {
        super();

        this.getAppClass = this.getAppClass.bind(this);
    }

    getAppClass() {
        const { view } = this.props;
        let className = `app app--${view.authenticated_user ? 'logged-in' : 'anonymous'}`;

        if (view.new_client_drawer) {
            className += ' app--new-client';
        }

        return className;
    }

    render() {
        const { children, ...passProps } = this.props;

        return (
            <div className={this.getAppClass()}>
                {children.map((child, i) => (
                    <div key={`child-component-${i}`}>{React.cloneElement(child, passProps)}</div>
                ))}
            </div>
        );
    }
}

App.propTypes = {
    view: PropTypes.shape({
        new_client_drawer: PropTypes.bool.isRequired
    }),
    children: PropTypes.node
};

const mapStateToProps = state => ({ view: state.view });
// const mapDispatchToProps = {};
const mapDispatchToProps = dispatch => bindActionCreators(actionCreators, dispatch);

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    firebaseConnect()
)(App);
