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
import
  {Container, Grid, Pagination, Header, Form, Tab, Table, Button, Responsive, Sticky, Segment, Popup}
    from 'semantic-ui-react';

import {getProduct, editProduct} from '../../actions';
import {formatDate, tryCatch, iterableArray as iArray} from '../../util';
import MyMap from '../MyMap';
import DefaultLoader from '../DefaultLoader';
import ResultsPerPage from '../ResultsPerPage';
import {GOOGLE_MAPS_KEY} from "../../config/keys";

/**
 * A component for viewing details about a product
 */
class ViewProduct extends Component {
  constructor(props) {
    super(props);

    this.renderMap = this.renderMap.bind(this);
    this.renderTable = this.renderTable.bind(this);
    this.onScreenSizeChange = _.debounce(this.onScreenSizeChange.bind(this), 20);
  }

  state = {
    startDate: undefined,
    endDate: undefined,
    activePage: 1,
    perPage: 10,
    column: "datetime",
    sortAsc: false,
    maps: [],
    fluidActions: false,
    showTable: true,
    isSticky: false
  };

  startDate;
  endDate;

  componentDidMount() {
    const {id} = this.props.match.params;
    this.props.getProduct(id);

    const checkSticky = () => {
      const {isSticky} = this.state;

      const bodyHeight = document.body.scrollHeight;
      const windowHeight = window.innerHeight;

      if(bodyHeight > windowHeight && windowHeight > 450) {
        if(!isSticky && (windowHeight / bodyHeight) < 0.72) {
          this.setState({isSticky: true});
        }
      } else if(isSticky) {
        this.setState({isSticky: false});
      }
    };

    window.onresize = _.debounce(checkSticky, 100);
    checkSticky();
  }

  componentDidUpdate() {
    // new content may have changed the document body's height
    window.onresize();
  }

  componentWillUnmount() {
    window.onresize = null;
  }

  onScreenSizeChange(e, {width}) {
    if(width > 991) {
      if(this.state.fluidActions) {
        this.setState({
          fluidActions: false
        });
      }
    } else {
      this.setState({
        fluidActions: true
      });
    }
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

    // cast props to numbers
    newLocations = newLocations.map(l => {
      const {datetime, latitude, longitude, elevation} = l;
      l.datetime = Number(datetime);
      l.latitude = Number(latitude);
      l.longitude = Number(longitude);
      l.elevation = Number(elevation);

      return l;
    });

    newLocations = _.orderBy(
      newLocations,
      [column],
      [sortAsc ? 'asc' : 'desc']
    );

    return newLocations;
  }

  renderTable() {
    const {activePage, perPage, fluidActions} = this.state;
    const {product} = this.props;
    const {_key} = product;
    const locations = this.filterLocations(product.locations);

    const totalPages = tryCatch(
      () => _.ceil(locations.length / perPage),
      0
    );

    if(totalPages < activePage) {
      setTimeout(
        () => this.setState({activePage: totalPages})
      );
    }

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
        <Table celled selectable striped stackable verticalAlign="middle" textAlign="center" fixed>
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
                .map(({datetime, elevation, latitude, longitude, address, key}) => {
                  const buttonProps = !fluidActions ? {} : {
                    fluid: true,
                    style: {marginTop: 2}
                  };

                  const actions = (
                    <Fragment>
                      <Button
                        color='yellow'
                        as={Link}
                        to={`/edit/${_key}/${key}`}
                        content="Edit"
                        {...buttonProps}
                      />
                      <Popup
                        hideOnScroll
                        inverted
                        content={
                          <Fragment>
                            <span style={{marginRight: 10}}>Are you sure?</span>
                            <Button
                              compact
                              color='red'
                              onClick={() => {
                                let newLocations = [...locations];
                                newLocations.splice(key, 1);
                                this.props.editProduct(_key, {locations: newLocations})
                              }}
                              content='Yes'
                            />
                          </Fragment>
                        }
                        on='click'
                        trigger={
                          <Button
                            color='red'
                            content="Delete"
                            {...buttonProps}
                          />
                        }
                      />
                    </Fragment>
                  );

                  return <Table.Row key={key}>
                    <Table.Cell>{formatDate(datetime)}</Table.Cell>
                    <Table.Cell>{latitude}</Table.Cell>
                    <Table.Cell>{longitude}</Table.Cell>
                    <Table.Cell>{elevation}</Table.Cell>
                    <Table.Cell>{address}</Table.Cell>
                    <Table.Cell>
                      <Responsive fireOnMount minWidth={992} onUpdate={this.onScreenSizeChange}>
                        <Button.Group fluid compact>
                          {actions}
                        </Button.Group>
                      </Responsive>
                      <Responsive maxWidth={991}>
                        {actions}
                      </Responsive>
                    </Table.Cell>
                  </Table.Row>
                })
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
    const locations = _.sortBy(product.locations, "datetime");

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

  page;

  render() {
    const {showTable, isSticky, perPage} = this.state;
    const {product} = this.props;
    const {description} = product;

    if(_.isEmpty(product)) {
      return <DefaultLoader/>;
    }

    const wrapSticky = (element) => {
      if(isSticky) {
        return (
          <Sticky context={this.page} pushing className="sticky">
            {element}
          </Sticky>
        );
      } else {
        return element;
      }
    };

    return(
      <Fragment>
        {wrapSticky(
          <div style={{marginBottom: 10}}>
            <Segment style={{marginBottom: 0, borderRadius: 0, marginTop: 0}} textAlign="center" inverted color="teal">
              <Header as="h3" >{description}</Header>
            </Segment>
            <Button.Group fluid>
            <Button
              content="Table"
              style={{borderRadius: 0}}
              primary={showTable}
              onClick={() => !showTable && this.setState({showTable: true})}
            />
            <Button
              content="Map"
              style={{borderRadius: 0}}
              primary={!showTable}
              onClick={() => showTable && this.setState({showTable: false})}
            />
            </Button.Group>
          </div>
        )}
        <div ref={r => this.page = r}>
        <Container textAlign="center">
          {!showTable ? this.renderMap() :
            <Fragment>
              {this.renderTable()}
              <Grid textAlign="center" style={{marginTop: 10, marginBottom: 5}}>
                <ResultsPerPage
                  perPage={perPage}
                  values={[5, 10, 20, 30, 50, 100]}
                  onClick={perPage => this.setState({perPage})}
                />
              </Grid>
            </Fragment>
          }
        </Container>
        </div>
      </Fragment>
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