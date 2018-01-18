/**
 * @author Philip Van Raalte
 * @date 2018-01-18
 */
import tryCatch from './tryCatch';

const defaultMapSize = 150;
let API_KEY = '';

let getStaticMapURL = ({lat, lng, key}, size = [defaultMapSize, defaultMapSize], zoom = 10) => {
  key = key || API_KEY;

  // handle if size is invalid
  if(!_.isArray(size)) {
    size = tryCatch(
      _.toInteger(size),
      defaultMapSize
    );

    size = [size, size];
  }

  const [width, height] = size;

  return `https://maps.googleapis.com/maps/api/staticmap` +
    String.raw`?key=${key}&size=${width}x${height}&markers=${lat},${lng}&zoom=${zoom}`;
};

getStaticMapURL.setKey = (key) => API_KEY = key;

export default getStaticMapURL;