export const moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  trailingZeroDisplay: 'stripIfInteger',
});

export const dateFormatter = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const dateFormatterFilename = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0].replace(/-/g, '.');
};
