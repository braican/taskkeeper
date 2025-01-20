import { InvoicedTask } from '@/types';

export const moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  trailingZeroDisplay: 'stripIfInteger',
});

export const dateFormatter = (dateString: string, format = 'default') => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  };

  if (format === 'numeric') {
    options.month = 'numeric';
  }

  return date.toLocaleDateString('en-US', options);
};

export const dateFormatterFilename = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0].replace(/-/g, '.');
};

export const todaysDate = () => new Date().toISOString().split('T')[0];

export const invoiceCost = (tasks: InvoicedTask[]) =>
  moneyFormatter.format(tasks.reduce((total, task) => total + task.cost, 0));
