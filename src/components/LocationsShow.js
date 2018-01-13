/**
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import React, {Component, Fragment} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import _ from 'lodash';

import {Button, EmptyState, Loading, Table} from './SpectreCSS';
import {getLocations} from '../actions';

class LocationsShow extends Component {
  componentDidMount() {
    this.props.getLocations();
  }

  renderLocations() {
    const {locations} = this.props;

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
        <Table.Body>
          {
            locations.map(({_key: key, description, datetime, longitude, latitude, elevation}) =>
              <tr key={key}>
                <td>{key}</td>
                <td>{description}</td>
                <td>{datetime}</td>
                <td>{longitude}</td>
                <td>{latitude}</td>
                <td>{elevation}</td>
              </tr>
            )
          }
        </Table.Body>
      </Table>
    );
  }

  render() {
    return(
      <Fragment>
        <div>
          <h3 className="float-left">Locations</h3>
          <Button as={Link} to={"/post"} primary className="float-right">
            Add Location
          </Button>
        </div>
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