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
import {Grid, Pagination, Button, Table, Form, Input} from 'semantic-ui-react';

import {EmptyState} from './SpectreCSS';
import {getProducts, deleteProduct} from '../actions';
import formatDate from '../util/formatDate';
import tryCatch from '../util/tryCatch';
import DefaultLoader from './DefaultLoader';

/**
 * A component for displaying products
 */
class ProductsShow extends Component {
  constructor(props) {
    super(props);

    this.onHeadingClicked = this.onHeadingClicked.bind(this);
  }

  state = {
    query: undefined,
    products: undefined,
    activePage: 1,
    perPage: 10,
    column: "_id",
    sortAsc: false
  };

  componentDidMount() {
    this.props.getLocations();
  }

  /**
   * Event handler for clicking a heading on a table.
   * It updates the state with the column and whether to sort in ascending order
   * @param clickedColumn
   */
  onHeadingClicked(clickedColumn) {
    if(clickedColumn === "Actions") {
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

    // sort the products by the selected column and order
    productsToReturn = _.orderBy(
      productsToReturn,
      [column],
      [sortAsc ? 'asc' : 'desc']
    );

    return productsToReturn;
  }

  renderLocations() {
    const products = this.filterProducts(this.props.products);

    // handle if products is empty
    if(_.isEmpty(products)) {
      if(_.isArray(products)) {
        // no products are available
        return(
          <EmptyState
            title="No products found."
          />
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
        <Table celled selectable striped stackable verticalAlign="middle" textAlign="center">
          <Table.Header>
            <Table.Row>
              {
                [
                  [<Fragment>
                    {'ID '}
                    {this.renderIcon('_id', false)}
                  </Fragment>, '_id'],
                  [<Fragment>
                    {'Description '}
                    {this.renderIcon('description', true)}
                  </Fragment>, 'description'],
                  [<Fragment>
                    {'Datetime '}
                    {this.renderIcon('datetime', false)}
                  </Fragment>, 'datetime'],
                  [<Fragment>
                    {'Longitude '}
                    {this.renderIcon('longitude', false)}
                  </Fragment>, 'longitude'],
                  [<Fragment>
                    {'Latitude '}
                    {this.renderIcon('latitude', false)}
                  </Fragment>, 'latitude'],
                  [<Fragment>
                    {'Elevation '}
                    {this.renderIcon('elevation', false)}
                  </Fragment>, 'elevation'],
                  "Actions"
                ].map(h =>
                  _.isArray(h)
                    ?
                    <Table.HeaderCell
                      key={`heading-${h[1]}`}
                      onClick={() => this.onHeadingClicked(h[1])}
                      style={{cursor: "pointer"}}
                    >
                      {h[0]}
                    </Table.HeaderCell>
                    :
                    <Table.HeaderCell
                      key={`heading-${h}`}
                    >
                      {h}
                    </Table.HeaderCell>
                )
              }
            </Table.Row>
          </Table.Header>
          <Table.Body>
          <Table.Row>
            {[...Array(6)].map((v, i) => <Table.Cell key={`cell-${i}`}/>)}
            <Table.Cell>
              <Button as={Link} to="post" fluid primary compact>Add Product</Button>
            </Table.Cell>
          </Table.Row>
            {
              // get set of products based on selected page
              products.slice((activePage*perPage)-perPage, (activePage * perPage) - 1)
                .map(({_key: key, description, datetime, longitude, latitude, elevation}) =>
                  <Table.Row key={key}>
                    <td>{key}</td>
                    <td>{description}</td>
                    <td>{formatDate(datetime)}</td>
                    <td>{longitude}</td>
                    <td>{latitude}</td>
                    <td>{elevation}</td>
                    <td>
                      <Button.Group fluid compact>
                        <Button
                          color='teal'
                          as={Link}
                          to={`/location/${key}`}
                        >
                          View
                        </Button>
                        <Button
                          color='yellow'
                          as={Link}
                          to={`/edit/${key}`}
                        >
                          Edit
                        </Button>
                        <Button
                          color='red'
                          onClick={() => this.props.deleteLocation(key)}
                        >
                          Delete
                        </Button>
                      </Button.Group>
                    </td>
                  </Table.Row>
              )
            }
          </Table.Body>
        </Table>
        {productsPagination}
      </Fragment>
    );
  }

  renderFilterOptions() {
    return(
      <Grid.Column width={16}>
        <Input
          fluid
          icon="search"
          onChange={e => this.setState(
            {query: _.toUpper(e.target.value)}
          )}
          placeholder="Search..."
        />
      </Grid.Column>
    );
  }

  render() {
    return(
      <Grid textAlign="center">
        <Grid.Row>
          <Grid.Column width={16}>
          {this.renderFilterOptions()}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row style={{marginTop: -15}}>
          {this.renderLocations()}
        </Grid.Row>
      </Grid>
    );
  }
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