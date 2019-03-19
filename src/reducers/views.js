export const initialState = { sidebarVisible: false };

export function views(state = initialState, action) {
  if (action.type === 'TOGGLE_CLIENT_SIDEBAR') {
    return { ...state, sidebarVisible: !state.sidebarVisible };
  }

  return state;
}
