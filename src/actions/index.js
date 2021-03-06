/**
 * index.js
 *
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import axios from 'axios';
import
  {GET_PRODUCTS, FAIL_PRODUCTS, CREATE_PRODUCT, GET_PRODUCT, FAIL_PRODUCT, DELETE_PRODUCT, GET_LOCATION,
    CLEAR_LOCATION}
    from './types';
import {change} from 'redux-form';

// the url for the api
const ROOT_URL = "http://45.77.106.244:7131/data";

// region Products
/**
 * Get the products from the server
 * @returns {function(*): Promise<AxiosResponse<any>>}
 */
export function getProducts() {
  return dispatch =>
    axios.get(ROOT_URL)
      .then(response =>
        dispatch({
          type: GET_PRODUCTS,
          payload: response
        })
      ).catch(
        error => dispatch({
          type: FAIL_PRODUCTS,
          error
        })
    );
}

/**
 * Send a product to the server to add
 * @param values
 * @param callback
 * @returns {function(*): Promise<AxiosResponse<any>>}
 */
export function createProducts(values, callback) {
  if(!_.isFunction(callback)) {
    callback = _.noop;
  }

  return dispatch =>
    axios.post(ROOT_URL, values)
      .then(response => callback(response) &&
        dispatch({
          type: CREATE_PRODUCT,
          payload: response
        })
      ).catch(
        error => callback(error) && dispatch({
          type: FAIL_PRODUCT,
          error
        })
    );
}
// endregion

// region Product
/**
 * Get a specific product from the server
 * @param id
 * @returns {function(*): Promise<AxiosResponse<any>>}
 */
export function getProduct(id) {
  return dispatch =>
    axios.get(`${ROOT_URL}/${id}`)
      .then(response =>
        dispatch({
          type: GET_PRODUCT,
          payload: response
        })
      ).catch(
      error => dispatch({
        type: FAIL_PRODUCT,
        error
      })
    );
}

/**
 * Edit a specific product
 * @param id
 * @param values
 * @param callback
 * @returns {function(*): Promise<AxiosResponse<any>>}
 */
export function editProduct(id, values, callback) {
  if(!_.isFunction(callback)) {
    callback = _.noop;
  }

  return dispatch =>
    axios.patch(`${ROOT_URL}/${id}`, values)
      .then(response => {
        callback(response);
        dispatch(getProduct(id))
      }).catch(
      error => callback(error) && dispatch({
        type: FAIL_PRODUCT,
        error
      })
    );
}

/**
 * Delete a product
 * @param id
 * @returns {function(*): Promise<AxiosResponse<any>>}
 */
export function deleteProduct(id) {
  return dispatch =>
    axios.delete(`${ROOT_URL}/${id}`)
      .then(response =>
        dispatch({
          type: DELETE_PRODUCT,
          payload: id
        })
      ).catch(
      error => dispatch({
        type: FAIL_PRODUCT,
        error
      })
    );
}
// endregion Location

/**
 * Get a location from a product
 * @param product
 * @param index
 * @returns {{type, payload: *}}
 */
export function getLocation(product, index) {
  return {
    type: GET_LOCATION,
    payload: product.locations[index]
  };
}

export function clearLocation(callback = _.noop) {
  setTimeout(callback, 100);

  return {
    type: CLEAR_LOCATION
  };
}
// region

export function changeFormField(form, field, value) {
  return dispatch => dispatch(
    change(form, field, value)
  );
}