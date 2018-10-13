// a reducer takes in two things:
//
// 1. the action (info about what happened)
// 2. copy of current state

function view(state = [], action) {
    switch (action.type) {
        case 'TOGGLE_NEW_CLIENT_DRAWER':
            return { ...state, new_client_drawer: !state.new_client_drawer };
        case 'TOGGLE_AUTHENTICATED_USER':
            return { ...state, authenticated_user: action.isAuth };
        default:
            return state;
    }
}

export default view;
