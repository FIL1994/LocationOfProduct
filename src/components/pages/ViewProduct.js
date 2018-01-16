/**
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import React, {Component, Fragment} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import _ from 'lodash';
import Datetime from 'react-datetime';
import moment from 'moment';
import {Container, Grid, Pagination, Header, Form} from 'semantic-ui-react';

import {getProduct, editProduct} from '../../actions';
import {Loading, Page, Table, Tab, Button} from '../SpectreCSS';
import formatDate from '../../util/formatDate';
import tryCatch from '../../util/tryCatch';
import MyMap from '../MyMap';

class ViewProduct extends Component {
  state = {
    tab: "table",
    startDate: undefined,
    endDate: undefined,
    activePage: 1,
    perPage: 20
  };
  startDate = undefined;
  endDate = undefined;

  componentDidMount() {
    const {id} = this.props.match.params;
    this.props.getProduct(id);
  }

  filterLocations(locations) {
    const {startDate, endDate} = this.state;

    function getTime(date) {
      return moment(date).toDate().getTime();
    }

    return tryCatch(
      () => {
        // date selected or earliest date in data set
        const start = getTime(startDate || _.min(
          this.props.product.locations.map(l => Number(l.datetime))
        ));
        // date selected or the current date
        const end = getTime(endDate || Date.now());

        // filter dates within range
        return locations.filter(({datetime}) => {
          datetime = Number(datetime);
          return datetime >= start && datetime <= end;
        });
      },
      locations
    );
  }

  renderContent() {
    const {activePage, tab, perPage} = this.state;
    const {product} = this.props;
    const {_key} = product;
    const locations = this.filterLocations(product.locations);

    switch(tab) {
      case "table":
        const totalPages = tryCatch(
          () => _.ceil(product.locations.length / perPage),
          0
        );

        const locationsPagination = totalPages < 2 ? '' :
          (
            <Grid.Column width={16} textAlign="center">
              <Pagination
                onPageChange={
                  (e, i) => this.setState({activePage: i.activePage})
                }
                defaultActivePage={activePage}
                totalPages={totalPages}
              />
            </Grid.Column>
          );

        return(
          <Fragment>
            <Grid.Column width={16} textAlign="center">
              {this.renderFilterOptions()}
            </Grid.Column>
            {locationsPagination}
            <Table centered striped hover>
              <Table.Head headings={["Datetime", "Elevation", "Latitude", "Longitude", "Actions"]}/>
              <thead>
              <tr>
                <td/><td/><td/><td/>
                <td>
                  <Button as={Link} to={`/location/${_key}/post`} primary>
                    Add Location
                  </Button>
                </td>
              </tr>
              {
                locations.slice((activePage*perPage)-perPage, (activePage * perPage) - 1)
                  .map(({datetime, elevation, latitude, longitude, key}) =>
                    <tr key={key}>
                      <td>{formatDate(datetime)}</td>
                      <td>{elevation}</td>
                      <td>{latitude}</td>
                      <td>{longitude}</td>
                      <td>
                        <Button.Group>
                          <Button as={Link} to={`/edit/${_key}/${key}`}>
                            Edit
                          </Button>
                          <Button
                            onClick={() => {
                              let newLocations = [...locations];
                              newLocations.splice(key, 1);
                              this.props.editProduct(_key, {locations: newLocations})
                            }}
                          >
                            Delete
                          </Button>
                        </Button.Group>
                      </td>
                    </tr>
                )
              }
              </thead>
            </Table>
            {locationsPagination}
          </Fragment>
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

  renderFilterOptions() {
    return(
      <Form>
        <span style={{float: "left"}}>
          <Datetime
            isValidDate={currentDate => moment(Date.now()).isAfter(currentDate)}
            ref={i => this.startDate = i}
            onChange={(m) => this.setState({startDate: m})}
            defaultValue={
              tryCatch(() => _.min(this.props.product.locations.map(l => Number(l.datetime))), 0)
            }
            utc
          />
        </span>
        to
        <span style={{float: "right"}}>
          <Datetime
            isValidDate={currentDate => moment(Date.now()).isAfter(currentDate)}
            ref={i => this.endDate = i}
            onChange={(m) => this.setState({endDate: m})}
            defaultValue={Date.now()}
            utc
          />
        </span>
      </Form>
    );
  }

  render() {
    const {product} = this.props;
    const {tab} = this.state;

    if(_.isEmpty(product)) {
      return <Page centered><Loading large/></Page>;
    }
    const {description} = product;

    return(
    <Container>
      <Grid>
        <Grid.Row>
          <Grid.Column width={16} textAlign="center">
            <Header as="h3">{description}</Header>
          </Grid.Column>
          <Grid.Column width={16}>
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
          </Grid.Column>
          {this.renderContent()}
        </Grid.Row>
      </Grid>
    </Container>
    );
  }
}

function mapStateToProps(state) {
  let {product} = state;

  if(!_.isEmpty(product)) {
    product.locations.map((l, index) => {
      l.key = index;
      return l;
    });

    return {
      product
    };
  }

  return {
    product
  };
}

export default connect(mapStateToProps, {getProduct, editProduct})(ViewProduct);