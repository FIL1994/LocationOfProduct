/**
 * Home.js
 *
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import React, {Component} from 'react';
import {Container} from 'semantic-ui-react';

import ProductsShow from '../ProductsShow';

/**
 * A component for the home page
 */
class Home extends Component {
  render() {
    return(
      <Container>
        <ProductsShow/>
      </Container>
    );
  }
}

export default Home;