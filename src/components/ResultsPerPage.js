/**
 * @author Philip Van Raalte
 * @date 2018-01-20
 */
import React from 'react';
import _ from 'lodash';
import {Segment, Button} from 'semantic-ui-react';
import PropTypes from 'prop-types';

let ResultsPerPage = (props) => (
  <Segment as="span" compact { ..._.omit(props, ["values", "perPage", "onClick"]) }>
      <span style={{marginRight: 8, verticalAlign: "middle"}}>
        Results Per Page:
      </span>
    <Button.Group style={{marginTop: 5}}>
      {
        props.values.map(i => (
          <Button key={i} primary={props.perPage === i} onClick={() => props.onClick(i)}>
            {i}
          </Button>
        ))
      }
    </Button.Group>
  </Segment>
);

ResultsPerPage.propTypes = {
  values: PropTypes.array,
  perPage: PropTypes.number.isRequired,
  onClick: PropTypes.func
};

ResultsPerPage.defaultProps = {
  values: [5, 10, 20],
  onClick: _.noop
};

export default ResultsPerPage;