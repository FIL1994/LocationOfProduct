/**
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import React, {Component} from 'react';

import {Page} from '../SpectreCSS';
import ProductsShow from '../ProductsShow';

class Home extends Component {
  render() {
    return(
      <Page centered>
        <ProductsShow/>
      </Page>
    );
  }
}

export default Home;