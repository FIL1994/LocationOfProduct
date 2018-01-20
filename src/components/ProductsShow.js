/**
 * ProductsShow.js
 *
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import React, {Component, Fragment} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import _ from 'lodash';
import {Grid, Pagination, Button, Input, Message, Select, Icon, Image, Card, Divider, Segment, Popup} from 'semantic-ui-react';

import {getProducts, deleteProduct} from '../actions';
import {formatDate, tryCatch, getStaticMapURL} from '../util';
import DefaultLoader from './DefaultLoader';
import {GOOGLE_MAPS_KEY} from '../config/keys';

getStaticMapURL.setKey(GOOGLE_MAPS_KEY);

/**
 * A component for displaying products
 */
class ProductsShow extends Component {
  constructor(props) {
    super(props);

    this.onHeadingClicked = this.onHeadingClicked.bind(this);
    // debounce function so it doesn't run every time the user presses a key
    this.onQueryChange = _.debounce(this.onQueryChange, 100);
  }

  state = {
    query: undefined,
    products: undefined,
    activePage: 1,
    perPage: 6,
    column: "_id",
    sortAsc: false,
    topVisible: false
  };

  componentDidMount() {
    this.props.getLocations();
  }

  onQueryChange(val) {
    this.setState(
      {query: _.toUpper(val)}
    );
  }

  /**
   * Event handler for clicking a heading on a table.
   * It updates the state with the column and whether to sort in ascending order
   * @param clickedColumn
   */
  onHeadingClicked(clickedColumn) {
    if(clickedColumn === "Actions" || clickedColumn === "Map") {
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

  filterProducts(products) {
    if(_.isEmpty(products)) {
      return undefined;
    }

    const {query, column, sortAsc} = this.state;

    let productsToReturn = [...products]; // clone products so state is not mutated
    if(!_.isEmpty(query)) {
      productsToReturn = _.compact(productsToReturn.map(p => {
        let send = false;

        // loop through the values in the object's entries and compare them to the search query
        const objectEntries = Object.entries(p);
        for (let i in objectEntries) {
          const [, value] = objectEntries[i];
          if (_.toUpper(value).includes(query)) {
            send = true;
            break;
          }
        }

        return send ? p : false;
      }));
    }

    // cast props to numbers
    productsToReturn = productsToReturn.map(p => {
      const {_key, datetime, latitude, longitude, elevation} = p;
      p._key = Number(_key);
      p.datetime = Number(datetime);
      p.latitude = Number(latitude);
      p.longitude = Number(longitude);
      p.elevation = Number(elevation);

      return p;
    });

    // sort the products by the selected column and order
    productsToReturn = _.orderBy(
      productsToReturn,
      [column],
      [sortAsc ? 'asc' : 'desc']
    );

    return productsToReturn;
  }

  renderCards(products) {
    const {activePage, perPage} = this.state;

    return (
      <Card.Group className="centered" style={{marginTop: 5, marginBottom: 5}}>
        {
          products.slice((activePage*perPage)-perPage, (activePage * perPage))
            .map(({_key: key, description, datetime, longitude: lng, latitude: lat, elevation, address}) => {
                const productLink = `/location/${key}`;
                return (
                  <Card key={key} link>
                    <Image
                      as={Link}
                      to={productLink}
                      src={getStaticMapURL({lat, lng}, [290, 163])}
                      alt="map"
                      rounded
                    />
                    <Card.Content as={Link} to={productLink}>
                      <Card.Header>
                        {description}
                      </Card.Header>
                      <Card.Meta>
                        {key} <br/>
                        {formatDate(datetime)}
                      </Card.Meta>
                      <Card.Description>
                        {address} <br/>
                        <Divider/>
                        Lat: {lat} |
                        Lng: {lng} |
                        Elev: {elevation}
                      </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      <div className="ui three buttons">
                        <Button
                          color='teal'
                          as={Link}
                          to={productLink}
                          content='History'
                        />
                        <Button
                          color='yellow'
                          as={Link}
                          to={`/edit/${key}`}
                          content='Edit'
                        />
                        <Popup
                          hideOnScroll
                          inverted
                          content={
                            <Fragment>
                              <span style={{marginRight: 5}}>Are you sure?</span>
                              <Button
                                compact
                                color='red'
                                onClick={() => this.props.deleteLocation(key)}
                                content='Yes'
                              />
                            </Fragment>
                          }
                          on='click'
                          trigger={
                            <Button
                              color='red'
                              content='Delete'
                            />
                          }
                        />
                      </div>
                    </Card.Content>
                  </Card>
                )
              }
            )
        }
      </Card.Group>
    );
  }

  renderResultsPerPage() {
    const {perPage} = this.state;

    return (
      <Segment as="span" compact>
          <span style={{marginRight: 8, verticalAlign: "middle"}}>
            Results Per Page:
          </span>
        <Button.Group style={{marginTop: 5}}>
          {
            [6, 12, 18].map(i => (
              <Button key={i} primary={perPage === i} onClick={() => this.setState({perPage: i})}>
                {i}
              </Button>
            ))
          }
        </Button.Group>
      </Segment>
    );
  }

  renderLocations() {
    const products = this.filterProducts(this.props.products);

    // handle if products is empty
    if(_.isEmpty(products)) {
      if(_.isArray(products)) {
        // no products are available
        return(
          <Message info size="big">
            No products found
          </Message>
        );
      }
      // locations are loading
      return <DefaultLoader/>;
    }

    const {activePage, perPage} = this.state;
    const totalPages = tryCatch(
      () => _.ceil(products.length / perPage),
      0
    );

    // only show pagination if there is more than 1 page
    const productsPagination = totalPages < 2 ? '' :
      (
        <Grid.Column width={16}>
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
        {productsPagination}
        {this.renderCards(products)}
        {productsPagination}
      </Fragment>
    );
  }

  renderFilterOptions() {
    const {sortAsc} = this.state;

    return(
      <Grid.Column width={16}>
        <Input
          fluid
          iconPosition="left"
          placeholder="Search for a product..."
          action
        >
          <Icon name='search'/>
          <input
            onChange={(e) => this.onQueryChange(e.target.value)}
          />
          <Button as="span" basic content="Sort By:" className="no-hover"/>
          <Select
            options={[
              {key: 'id', text: 'ID', value: '_id'},
              {key: 'description', text: 'Description', value: 'description'},
              {key: 'datetime', text: 'Datetime', value: 'datetime'},
              {key: 'latitude', text: 'Latitude', value: 'latitude'},
              {key: 'longitude', text: 'Longitude', value: 'longitude'},
              {key: 'elevation', text: 'Elevation', value: 'elevation'}
            ]}
            onChange={
              (e, select) => {
                if(this.state.column !== select.value) {
                  this.setState({column: select.value})
                }
              }
            }
            defaultValue='_id'
          />
          <Button icon labelPosition="right" onClick={() => this.setState({sortAsc: !sortAsc})}>
            <Icon name={sortAsc ? "chevron up": "chevron down"}/>
            Order
          </Button>
        </Input>
      </Grid.Column>
    );
  }

  render = () => (
    <Grid textAlign="center">
      <Grid.Row>
        <Grid.Column width={16}>
          {this.renderFilterOptions()}
        </Grid.Column>
      </Grid.Row>
      <Grid.Row style={{marginTop: -15}}>
        {this.renderLocations()}
      </Grid.Row>
      <Grid.Row>
        {_.isEmpty(this.props.products) ? '' : this.renderResultsPerPage()}
        <Popup
          hideOnScroll
          inverted
          content='Add New Product'
          trigger={
            <Button
              as={Link}
              to="/post"
              icon="plus"
              circular
              color="blue"
              size="massive"
              style={{
                position: "fixed",
                zIndex: "6",
                right: "2.5%",
                bottom: "2.5%"
              }}
            />
          }
        />
      </Grid.Row>
    </Grid>
  );
}

function mapStateToProps(state) {
  const {products} = state;

  if(_.isArray(products)) {
    return {
      products: products.map(p => (
        // get the product and the properties from the most recent location (datetime, lng, lat, elev)
        {...p, ...p.locations.slice(-1)[0]}
      ))
    };
  }

  return {
    products
  };
}

export default connect(mapStateToProps, {getLocations: getProducts, deleteLocation: deleteProduct})(ProductsShow);