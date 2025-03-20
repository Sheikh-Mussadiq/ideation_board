/**
 * Normalizes data returned from a query that might be an object or array
 * This handles inconsistencies with .single() sometimes returning an array instead of object
 * 
 * @param {Object|Array} data - The data to normalize
 * @returns {Object|null} - The normalized data (first element if array, or the object itself)
 */
export function normalizeSingleResult(data) {
  if (!data) return null;
  // If data is an array, take the first element
  if (Array.isArray(data) && data.length > 0) {
    return data[0];
  }
  // Otherwise return the data as is (object)
  return data;
}
