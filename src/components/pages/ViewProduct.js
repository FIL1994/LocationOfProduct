/**
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';

import {GoogleMap, Marker, withGoogleMap, withScriptjs, Polyline} from 'react-google-maps';

import {getProduct} from '../../actions';
import {Loading, Page, Table, Tab} from '../SpectreCSS';

const MyMap = withScriptjs(withGoogleMap((props) => {
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

class ViewProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tab: "table"
    };
  }

  componentDidMount() {
    const {id} = this.props.match.params;
    this.props.getLocation(id);
  }

  renderContent() {
    const {product} = this.props;
    const {locations, _key} = product;

    switch(this.state.tab) {
      case "table":
        return(
          <Table centered striped hover>
            <Table.Head headings={["Datetime", "Elevation", "Latitude", "Longitude"]}/>
            <thead>
            {
              locations.map(({datetime, elevation, latitude, longitude}, index) =>
                <tr key={index}>
                  <td>{datetime}</td>
                  <td>{elevation}</td>
                  <td>{latitude}</td>
                  <td>{longitude}</td>
                </tr>
              )
            }
            </thead>
          </Table>
        );
      case "map":
        const {latitude, longitude} = locations.slice(-1)[0];
        return(
          <MyMap
            key={_key}
            isMarkerShown
            lat={Number(latitude)}
            lng={Number(longitude)}
            positions={locations}
            googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyDqMPwl5XjyehPhDDkRx8wfO0pdtOxghng"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `500px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
        );
    }
  }

  render() {
    const {product} = this.props;
    const {tab} = this.state;

    if(_.isEmpty(product)) {
      return <Page centered><Loading large/></Page>;
    }
    const {description} = product;

    return(
    <Page centered>
      Description: {description}
      <hr/>
      <Tab block>
        <Tab.Heading
          active={tab === "table"}
          onClick={() => this.setState({tab: "table"})}
        >
          <a href="#">Table</a>
        </Tab.Heading>
        <Tab.Heading
          active={tab === "map"}
          onClick={() => this.setState({tab: "map"})}
        >
          <a href="#">Map</a>
        </Tab.Heading>
      </Tab>
      {this.renderContent()}
    </Page>
    );
  }
}

function mapStateToProps(state) {
  const {product} = state;

  if(!_.isEmpty(product)) {
    return {
      product
    };
  }

  return {
    product
  };
}

export default connect(mapStateToProps, {getLocation: getProduct})(ViewProduct);