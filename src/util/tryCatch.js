/**
 * @author Philip Van Raalte
 * @date 2018-01-15
 */

/**
 * A function that runs a function in a try catch and returns a defaultValue if an error is thrown.
 * @param functionToTry
 * @param defaultValue
 * @param log
 * @returns {*}
 */
export default (functionToTry, defaultValue = undefined, log = false) =>  {
  try {
    return functionToTry();
  } catch (e) {
    if(log) {
      console.error(e);
    }
    return defaultValue
  }
}