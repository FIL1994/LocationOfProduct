/**
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import axios from 'axios';
import {GET_PRODUCTS, FAIL_PRODUCTS, CREATE_PRODUCT, EDIT_PRODUCT, GET_PRODUCT, FAIL_PRODUCT, DELETE_PRODUCT}
  from './types';

//API Info
const ROOT_URL = "http://45.77.106.244:7131/data";

// region Locations
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

export function createProducts(values, callback) {
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

// region Location
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

export function editProduct(id, values, callback) {
  return dispatch =>
    axios.put(`${ROOT_URL}/${id}`, values)
      .then(response => callback(response) &&
        dispatch({
          type: GET_PRODUCT,
          payload: response
        })
      ).catch(
      error => callback(error) && dispatch({
        type: FAIL_PRODUCT,
        error
      })
    );
}

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
// endregion