
import React from 'react';
import PropTypes from 'prop-types';

import { getTaskPrice, formatPrice } from '../helpers';


const Task = (props) => {
    const description = props.children;
    const { hours, rate, price } = props;
    return (
        <li className="task">
            <span className="task__description">{description}</span>
            <span className="task__hours">{hours}</span>
            <span className="task__price">{formatPrice(getTaskPrice(hours, price, rate))}</span>
        </li>
    );
};

Task.propTypes = {
    children : PropTypes.string,
    hours    : PropTypes.number,
    price    : PropTypes.number,
    rate     : PropTypes.number.isRequired,
};

Task.defaultProps = {
    children : '',
    hours    : 0,
    price    : null,
};

export default Task;
