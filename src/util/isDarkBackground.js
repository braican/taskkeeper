const hexToRgb = hex => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : null;
};

export const isDarkBackground = color => {
  const [r, g, b] = hexToRgb(color);
  const o = Math.round((r * 299 + g * 587 + b * 114) / 1000);
  return o < 126;
};
