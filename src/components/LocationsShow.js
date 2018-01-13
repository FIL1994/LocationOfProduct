/**
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';

import {EmptyState, Loading, Table, TableHeading} from './SpectreCSS';
import {getLocations} from '../actions';

class LocationsShow extends Component {
  componentDidMount() {
    this.props.getLocations();
  }

  renderLocations() {
    const {locations} = this.props;
    console.log(locations);

    // handle if locations is empty
    if(_.isEmpty(locations)) {
      if(_.isArray(locations)) {
        // no locations are available
        return(
          <EmptyState
            title="No locations found."
          />
        );
      }
      // locations are loading
      return <Loading large/>;
    }

    return(
      <Table striped hover>
        <Table.Head headings={["id", "description", "datetime", "longitude", "latitude", "elevation"]}/>
      </Table>
    );
  }

  render() {
    return(
      <Fragment>
        <h3>Locations</h3>
        {this.renderLocations()}
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    locations: state.locations
  };
}

export default connect(mapStateToProps, {getLocations})(LocationsShow);