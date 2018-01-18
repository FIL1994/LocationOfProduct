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
import CreateProduct from './pages/CreateProduct';
import EditProduct from './pages/EditProduct';
import ViewProduct from './pages/ViewProduct';
import EditLocation from './pages/EditLocation';
import CreateLocation from './pages/CreateLocation';

class App extends Component {
  render() {
    return(
      <BrowserRouter>
        <div id="site" className="site">
          <div className="site-content">
            <HeaderNav/>
            <Switch>
              <Route exact path="/" component={Home}/>
              <Route path="/post" component={CreateProduct}/>
              <Route exact path="/edit/:id" component={EditProduct}/>
              <Route exact path="/edit/:id/:index" component={EditLocation}/>
              <Route exact path="/location/:id/post" component={CreateLocation}/>
              <Route path="/location/:id" component={ViewProduct}/>
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