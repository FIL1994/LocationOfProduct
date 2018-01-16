/**
 * DefaultLoader.js
 *
 * @author Philip Van Raalte
 * @date 2018-01-16
 */
import React, {Fragment} from 'react';
import {Loader} from 'semantic-ui-react';

export default (props) => {
  return(
    <Fragment>
      <div style={{marginTop: 50}}/>
      <Loader size="large" active content='Loading'/>
    </Fragment>
  );
};