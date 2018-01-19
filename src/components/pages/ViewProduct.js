/**
 * ViewProduct.js
 *
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import React, {Component, Fragment} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import _ from 'lodash';
import Datetime from 'react-datetime';
import moment from 'moment';
import {Container, Grid, Pagination, Header, Form, Tab, Table, Button} from 'semantic-ui-react';

import {getProduct, editProduct} from '../../actions';
import formatDate from '../../util/formatDate';
import tryCatch from '../../util/tryCatch';
import iArray from '../../util/iterableArray';
import MyMap from '../MyMap';
import DefaultLoader from '../DefaultLoader';
import {GOOGLE_MAPS_KEY} from "../../config/keys";

/**
 * A component for viewing details about a product
 */
class ViewProduct extends Component {
  constructor(props) {
    super(props);

    this.renderMap = this.renderMap.bind(this);
    this.renderTable = this.renderTable.bind(this);
  }

  state = {
    startDate: undefined,
    endDate: undefined,
    activePage: 1,
    perPage: 15,
    column: "datetime",
    sortAsc: false,
    maps: []
  };
  startDate;
  endDate;

  componentDidMount() {
    const {id} = this.props.match.params;
    this.props.getProduct(id);
  }

  /**
   * Event handler for clicking a heading on a table.
   * It updates the state with the column and whether to sort in ascending order
   * @param clickedColumn
   */
  onHeadingClicked(clickedColumn) {
    if(clickedColumn === "actions") {
      return;
    }
    let {column, sortAsc} = this.state;

    if(column !== clickedColumn) {
      sortAsc = true;
    } else {
      sortAsc = !sortAsc;
    }

    this.setState({
      column: clickedColumn,
      sortAsc
    });
  }

  /**
   * Returns an icon to represent if the table heading is being sorted
   * @param thisColumn
   * @param isString
   * @returns {JSX} <i/> component
   */
  renderIcon(thisColumn, isString) {
    const {column, sortAsc} = this.state;
    let className = "fa fa-sort";

    if(thisColumn === column) {
      if(isString) {
        className = sortAsc ? "fa fa-sort-alpha-asc " : "fa fa-sort-alpha-desc";
      }
      else {
        className = sortAsc ? "fa fa-sort-numeric-asc" : "fa fa-sort-numeric-desc";
      }
    }

    return <i className={className} aria-hidden="true"/>;
  }

  filterLocations(locations) {
    const {startDate, endDate, column, sortAsc} = this.state;

    function getTime(date) {
      return moment(date).toDate().getTime();
    }

    let newLocations = tryCatch(
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

    newLocations = _.orderBy(
      newLocations,
      [column],
      [sortAsc ? 'asc' : 'desc']
    );

    return newLocations;
  }

  renderTable() {
    const {activePage, perPage} = this.state;
    const {product} = this.props;
    const {_key} = product;
    const locations = this.filterLocations(product.locations);

    const totalPages = tryCatch(
      () => _.ceil(locations.length / perPage),
      0
    );

    // only show pagination if there is more than 1 page
    const locationsPagination = totalPages < 2 ? '' :
      (
        <Grid.Column width={16} textAlign="center">
          <Pagination
            onPageChange={
              (e, i) => this.setState({activePage: i.activePage})
            }
            activePage={activePage}
            totalPages={totalPages}
          />
        </Grid.Column>
      );

    return(
      <Fragment>
        {this.renderFilterOptions()}
        <div style={{marginTop: 5}}/>
        {locationsPagination}
        <Table celled selectable striped stackable verticalAlign="middle" textAlign="center">
          <Table.Header>
            <Table.Row>
              {
                ["Datetime", "Latitude", "Longitude", "Elevation", "Address", "Actions"].map( h=>
                  <Table.HeaderCell
                    key={`heading-${h}`}
                    onClick={() => this.onHeadingClicked(_.toLower(h))}
                    {
                      ...(
                        h === "Actions" ? {} :
                          {style: {cursor: "pointer"}}
                      )
                    }
                  >
                    {`${h} `}
                    {
                      h === "Actions" ? '' :
                        this.renderIcon(_.toLower(h), false)
                    }
                  </Table.HeaderCell>
                )
              }
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              {
                iArray(5).map((v, i) => <Table.Cell key={`cell-${i}`}/>)
              }
              <Table.Cell>
                <Button as={Link} to={`/location/${_key}/post`} fluid primary>
                  Add Location
                </Button>
              </Table.Cell>
            </Table.Row>
            {
              // get set of locations based on selected page
              locations.slice((activePage*perPage)-perPage, (activePage * perPage) - 1)
                .map(({datetime, elevation, latitude, longitude, address, key}) =>
                  <Table.Row key={key}>
                    <Table.Cell>{formatDate(datetime)}</Table.Cell>
                    <Table.Cell>{latitude}</Table.Cell>
                    <Table.Cell>{longitude}</Table.Cell>
                    <Table.Cell>{elevation}</Table.Cell>
                    <Table.Cell>{address}</Table.Cell>
                    <Table.Cell>
                      <Button.Group fluid compact>
                        <Button
                          color='yellow'
                          as={Link}
                          to={`/edit/${_key}/${key}`}
                        >
                          Edit
                        </Button>
                        <Button
                          color='red'
                          onClick={() => {
                            let newLocations = [...locations];
                            newLocations.splice(key, 1);
                            this.props.editProduct(_key, {locations: newLocations})
                          }}
                        >
                          Delete
                        </Button>
                      </Button.Group>
                    </Table.Cell>
                  </Table.Row>
                )
            }
          </Table.Body>
        </Table>
        {locationsPagination}
      </Fragment>
    );
  }

  renderMap() {
    const {product} = this.props;
    const {_key} = product;
    const locations = this.filterLocations(product.locations);

    const {latitude, longitude} = locations.slice(-1)[0];
    const {latitude: startLatitude, longitude: startLongitude} = locations[0];

    return(
      <MyMap
        key={_key}
        isMarkerShown
        lat={Number(latitude)}
        lng={Number(longitude)}
        positions={locations}
        googleMapURL={
          `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${GOOGLE_MAPS_KEY}`
        }
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `500px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
        {
          ...(locations.length < 2 ? {} : {
            startPosition: {lat: Number(startLatitude), lng: Number(startLongitude)}
          })
        }
      />
    );
  }

  renderFilterOptions() {
    return(
      <Form>
        <Grid centered verticalAlign="top" textAlign="center">
          <Grid.Row>
            <Grid.Column width={1}/>
            <Grid.Column width={6}>
              <Datetime
                isValidDate={
                  // don't allow dates in the future
                  currentDate => moment(Date.now()).isAfter(currentDate)
                }
                ref={i => this.startDate = i}
                onChange={m => this.setState({startDate: m})}
                defaultValue={
                  tryCatch(() => _.min(this.props.product.locations.map(l => Number(l.datetime))), 0)
                }
                utc
              />
            </Grid.Column>
            <Grid.Column width={2} textAlign="center" style={{marginTop: 8}}>
              to
            </Grid.Column>
            <Grid.Column width={6}>
              <Datetime
                isValidDate={currentDate => moment(Date.now()).isAfter(currentDate)}
                ref={i => this.endDate = i}
                onChange={(m) => this.setState({endDate: m})}
                defaultValue={Date.now()}
                utc
              />
            </Grid.Column>
            <Grid.Column width={1}/>
          </Grid.Row>
        </Grid>
      </Form>
    );
  }

  render() {
    const {product} = this.props;
    const {description} = product;

    if(_.isEmpty(product)) {
      return <DefaultLoader/>;
    }

    return(
    <Container textAlign="center">
      <Header as="h3">{description}</Header>
      <Tab
        menu={{secondary: true, pointing: true}}
        panes={[
          {menuItem: 'Table', render: this.renderTable},
          {menuItem: 'Map', render: this.renderMap}
        ]}
      />
    </Container>
    );
  }
}

function mapStateToProps(state) {
  let {product} = state;

  if(!_.isEmpty(product)) {
    // give locations a key based on their index
    // index is unreliable cant be used after locations are filtered
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