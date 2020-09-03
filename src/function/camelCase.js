/**
 * Converts any string into camelCase
 * @param {string} value - sentence case string
 * @returns {string} value converted to camelCase string
 * @example
 * // returns "workPlace"
 * camelCase("work place")
 */
export const camelCase = (value) => {
  return value.toLowerCase().replace(/\s+(.)/g, function (match, group) {
    return group.toUpperCase();
  });
};
