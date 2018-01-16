/**
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import React from 'react';
import {Segment, Container, List} from 'semantic-ui-react';

export default () =>
  <Segment as="footer" inverted>
    <Container textAlign="center">
      <List inverted link>
        <List.Item
          as="a"
          href="http://www.philvr.com"
        >
          Philip Van Raalte
        </List.Item>
        <List.Item
          as="a"
          href="http://45.77.106.244:7131"
        >
          Location of Product API
        </List.Item>
      </List>
    </Container>
  </Segment>;