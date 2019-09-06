import { arrayRemove } from '../utils';

export const initialState = {
  isInvoicing: false,
  tasks: [],
  subtotal: 0,
  hours: 0,
};

export const invoiceReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_INVOICING':
      return { ...state, isInvoicing: true };
    case 'UNSET_INVOICING':
      return { ...state, isInvoicing: false, tasks: [], subtotal: 0, hours: 0 };
    case 'REMOVE_INVOICE_TASK': {
      const { taskId, cost, hours } = action;

      if (!taskId) {
        return state;
      }

      const newTasks = arrayRemove([...state.tasks], taskId);
      const newSubtotal = state.subtotal - parseFloat(cost);
      const newHours = state.hours - parseFloat(hours);

      return { ...state, tasks: newTasks, subtotal: newSubtotal, hours: newHours };
    }
    case 'ADD_INVOICE_TASK': {
      const { taskId, cost, hours } = action;

      if (!taskId) {
        return state;
      }

      const newTasks = [...state.tasks];
      const newSubtotal = state.subtotal + parseFloat(cost);
      const newHours = state.hours + parseFloat(hours);

      newTasks.push(taskId);
      return { ...state, tasks: newTasks, subtotal: newSubtotal, hours: newHours };
    }
    default:
      return state;
  }
};
