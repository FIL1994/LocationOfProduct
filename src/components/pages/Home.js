/**
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import React, {Component} from 'react';

import {Page} from '../SpectreCSS';
import LocationsShow from '../LocationsShow';

class Home extends Component {
  render() {
    return(
      <Page centered>
        <LocationsShow/>
      </Page>
    );
  }
}

export default Home;