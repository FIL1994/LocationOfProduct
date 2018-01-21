/**
 * MyMap.js
 *
 * @author Philip Van Raalte
 * @date 2018-01-15
 */
import React from 'react';
import {withGoogleMap, withScriptjs, GoogleMap, Polyline, Marker, InfoWindow} from 'react-google-maps';

/**
 * A component for showing a GoogleMap component with a Polyline and a Marker
 */
export default withScriptjs(withGoogleMap((props) => {
    const {lat, lng, isMarkerShown, startPosition} = props;
    const position = {lat, lng};

    return(
      <GoogleMap
        defaultZoom={10}
        defaultCenter={position}
      >
        <Polyline
          path={
            props.positions.map(({latitude: lat, longitude: lng}) => ({lat: Number(lat), lng: Number(lng)}))
          }
          options={{
            strokeColor: '#14be39',
            strokeOpacity: 1,
            strokeWeight: 2
          }}
        />
        {
          startPosition &&
          <Marker
            position={startPosition}
          >
            <InfoWindow>
              <b>Start</b>
            </InfoWindow>
          </Marker>
        }
        {
          isMarkerShown &&
          <Marker
            position={position}
          >
            <InfoWindow>
              <b>Current</b>
            </InfoWindow>
          </Marker>
        }
      </GoogleMap>
    );
  }
));