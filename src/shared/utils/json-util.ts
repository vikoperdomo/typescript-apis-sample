/**
 * Parse json data
 * @param {string} rawValue
 * @returns {JSON}
 */
export function parseJsonData(rawValue: string) {
  if (!rawValue) {
    return null;
  }
  try {
    return JSON.parse(rawValue);
  } catch (error) {
    return null;
  }
}
