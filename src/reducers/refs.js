export const initialState = {
  clients: null,
  tasks: null,
  invoices: null,
};

export function refs(state = initialState, action) {
  if (action.type === 'ADD_CLIENT_REF') {
    return { ...state, clients: action.ref };
  }
  if (action.type === 'ADD_TASK_REF') {
    return { ...state, tasks: action.ref };
  }
  if (action.type === 'ADD_INVOICE_REF') {
    return { ...state, invoices: action.ref };
  }
  return state;
}
