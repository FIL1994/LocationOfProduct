/**
 * MyMap.js
 *
 * @author Philip Van Raalte
 * @date 2018-01-15
 */
import React from 'react';
import {withGoogleMap, withScriptjs, GoogleMap, Polyline, Marker} from 'react-google-maps';

export default withScriptjs(withGoogleMap((props) => {
    const {lat, lng} = props;
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
        {props.isMarkerShown && <Marker position={position}/>}
      </GoogleMap>
    );
  }
));