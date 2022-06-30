export const toDateInputValue = (date = new Date()) => {
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toJSON().slice(0, 10);
};

export const addDays = (days, date = new Date()) => {
  date.setDate(date.getDate() + days);
  return date;
};

export const formatDate = date =>
  new Date(date).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
