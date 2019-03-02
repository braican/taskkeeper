const rootReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_CLIENT':
      return { ...state, clients: state.clients.concat(action.payload) };
    default:
      return state;
  }
};

export default rootReducer;
