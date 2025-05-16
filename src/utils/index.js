/**
 * Converts Celsius to Fahrenheit
 * @param {number} celsius - Temperature in Celsius
 * @returns {number} Temperature in Fahrenheit, rounded to 2 decimal places
 */
export const celsiusToFahrenheit = (celsius) => Number(((celsius * 9/5) + 32).toFixed(2)); 