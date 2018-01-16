/**
 * @author Philip Van Raalte
 * @date 2018-01-15
 */

export default (functionToTry, defaultValue, log = false) =>  {
  try {
    return functionToTry();
  } catch (e) {
    if(log) {
      console.error(e);
    }
    return defaultValue
  }
}