/**
 * @author Philip Van Raalte
 * @date 2018-01-15
 */
import moment from 'moment';

export default (date) => {
  return moment(new Date(Number(date))).utc().format('MMM D YYYY, h:mm:ss a');
}