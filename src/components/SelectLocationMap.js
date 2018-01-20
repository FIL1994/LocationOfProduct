/**
 * @author Philip Van Raalte
 * @date 2018-01-20
 */

import React, {Component} from 'react';
import {withGoogleMap, withScriptjs, GoogleMap, Marker} from 'react-google-maps';
import _ from 'lodash';
import PropTypes from 'prop-types';

/**
 * A component for showing a GoogleMap component with a draggable Marker
 */
class SelectLocationMapWithoutScript extends Component {
  map;

  componentDidUpdate(prevProps) {
    const {lat, lng} = this.props;
    if(prevProps.lat !== lat || prevProps.lng !== lng) {
      this.map.panTo({lat, lng});
    }
  }

  render() {
    const {lat, lng, onDrag} = this.props;
    const position = {lat, lng};

    return (
      <GoogleMap
        defaultZoom={12}
        defaultCenter={position}
        ref={gm => this.map = gm}
      >
        <Marker
          draggable
          position={position}
          onDragEnd={
            ({latLng: {lat, lng}}) => onDrag({lat: lat(), lng: lng()})
          }
        />
      </GoogleMap>
    );
  }
}

SelectLocationMapWithoutScript.defaultProps = {
  onDrag: _.noop
};


const SelectLocationMap = withScriptjs(withGoogleMap(
  SelectLocationMapWithoutScript
));

let SelectLocationMapComponent = (props) => (
  <SelectLocationMap
    {...props}
    googleMapURL={
      `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${props.apiKey}`
    }
    loadingElement={<div style={{ height: `100%` }} />}
    containerElement={<div style={{ height: `${props.height}px` }} />}
    mapElement={<div style={{ height: `100%` }} />}
  />
);

SelectLocationMapComponent.defaultProps = {
  height: 300
};

SelectLocationMapComponent.propTypes = {
  apiKey: PropTypes.string.isRequired,
  onDrag: PropTypes.func,
  lat: PropTypes.number,
  lng: PropTypes.number
};

export default SelectLocationMapComponent;