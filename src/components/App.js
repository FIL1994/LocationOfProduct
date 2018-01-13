/**
 * App.js
 *
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import React, {Component} from 'react';
import LocationsShow from './LocationsShow';

class App extends Component {
  render() {
    return(
      <div>
        Location App
        <LocationsShow/>
      </div>
    );
  }
}

export default App;