import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../../actions/actionCreators';
import { NavLink } from 'react-router-dom';

class Main extends React.Component {
    render() {
        return (
            <div>
                <h1>
                    <NavLink to="/">Nixtagram</NavLink>
                </h1>

                {React.cloneElement(this.props.children, this.props)}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        view: state.view
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

const App = connect(
    mapStateToProps,
    mapDispatchToProps
)(Main);

export default App;
