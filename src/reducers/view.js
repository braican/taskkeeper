// a reducer takes in two things:
//
// 1. the action (info about what happened)
// 2. copy of current state

function view(state = [], action) {
    switch (action.type) {
        case 'TOGGLE_NEW_CLIENT_DRAWER':
            console.log(state);
            return state;
        default:
            return state;
    }
}

export default view;
