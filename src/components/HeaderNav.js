/**
 * HeaderNav.js
 *
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import React from 'react';
import {NavLink, Link} from 'react-router-dom';
import {Menu, Segment} from 'semantic-ui-react';

function isLinkActive(match) {
  if(!match) {
    return false;
  }
  return !(match.url === "/" && !match.isExact);
}

/**
 * A component for the header of the page
 * @returns {*}
 */
export default (props) => {
    return(
      <Segment {...props} color="black" inverted as="header" id="header">
        <Menu inverted secondary size="large">
          <Menu.Item as={Link} to="/" id="page-title">
            Product Locator
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item as={NavLink} to="/" activeClassName="active" isActive={isLinkActive}>
              Home
            </Menu.Item>
            <Menu.Item as={NavLink} to="/post" activeClassName="active" isActive={isLinkActive}>
              Add Product
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </Segment>
    );
};