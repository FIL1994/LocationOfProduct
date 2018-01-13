/**
 * App.js
 *
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import React, {Component} from 'react';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';

import HeaderNav from './HeaderNav';
import Footer from './Footer';
import Home from './pages/Home';
import CreateLocation from './pages/CreateLocation';
import EditLocation from './pages/EditLocation';

class App extends Component {
  render() {
    return(
      <BrowserRouter>
        <div id="site" className="site">
          <div className="site-content">
            <HeaderNav/>
            <Switch>
              <Route exact path="/" component={Home}/>
              <Route path="/post" component={CreateLocation}/>
              <Route path="/edit/:id" component={EditLocation}/>
              <Redirect to="/"/>
            </Switch>
          </div>
          <Footer/>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;