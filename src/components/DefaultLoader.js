/**
 * DefaultLoader.js
 *
 * @author Philip Van Raalte
 * @date 2018-01-16
 */
import React, {Fragment} from 'react';
import {Loader} from 'semantic-ui-react';

/**
 * A Semantic-UI Loader with custom default props
 * @param props
 * @returns {*}
 */
export default (props) => {
  return(
    <Fragment>
      <div style={{marginTop: 50}}/>
      <Loader {...props} size="large" active content='Loading'/>
    </Fragment>
  );
};