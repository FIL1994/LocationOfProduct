/**
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {getLocations} from '../actions';

class LocationsShow extends Component {
  componentDidMount() {
    this.props.getLocations();
  }

  render() {
    const {locations} = this.props;
    console.log(locations);

    return(
      <div>
        Locations
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    locations: state.locations
  };
}

export default connect(mapStateToProps, {getLocations})(LocationsShow);