/**
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import React, {Component} from 'react';
import {NavLink, withRouter} from 'react-router-dom';
import {Menu, Segment} from 'semantic-ui-react';

class HeaderNav extends Component {
  isLinkActive(match) {
    if(!match) {
      return false;
    }
    return !(match.url === "/" && !match.isExact);
  }

  render() {
    return(
      <Segment inverted as="header">
        <Menu inverted secondary size="large">
          <Menu.Item>
            <h4>Location of Product</h4>
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item as={NavLink} to="/" activeClassName="active" isActive={this.isLinkActive}>
              Home
            </Menu.Item>
            <Menu.Item as={NavLink} to="/post" activeClassName="active" isActive={this.isLinkActive}>
              Add Product
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </Segment>
    );
  }
}

export default withRouter(HeaderNav);