const rootReducer = (state = [], action) => {
  console.log(state);

  switch (action.type) {
    case 'ADD_CLIENT':
      return { ...state };
    default:
      return state;
  }
};

export default rootReducer;
