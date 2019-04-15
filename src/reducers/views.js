export const initialState = { sidebarVisible: false };

export function views(state = initialState, action) {
  if (action.type === 'TOGGLE_CLIENT_SIDEBAR') {
    const newSidebarVisible = action.isOpen === undefined ? !state.sidebarVisible : action.isOpen;
    return { ...state, sidebarVisible: newSidebarVisible };
  }

  return state;
}
