/**
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import React, {Component, Fragment} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import _ from 'lodash';

import {Button, EmptyState, Loading, Table, Pagination} from './SpectreCSS';
import {getProducts, deleteProduct} from '../actions';
import formatDate from '../util/formatDate';
import tryCatch from '../util/tryCatch';

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
    if(products === undefined) {
      return undefined;
    }
    const {query, column, sortAsc} = this.state;

    let productsToReturn = [...products];
    if(!_.isEmpty(query)) {
      productsToReturn = _.compact(productsToReturn.map(p => {
        let send = false;

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
      return <Loading large/>;
    }

    const {activePage, perPage} = this.state;
    const totalPages = tryCatch(
      () => _.ceil(products.length / perPage),
      0
    );

    const productsPagination = totalPages < 2 ? '' :
      <Pagination
        centered
        onClick={
          (e, i) => this.setState({activePage: i})
        }
        activePage={activePage}
        totalPages={totalPages}
      />;

    return(
      <Fragment>
        {productsPagination}
        <Table centered striped hover>
          <Table.Head
            headings={[
              [<div className="c-hand">
                {'ID '}
                {this.renderIcon('_id', false)}
              </div>, '_id'],
              [<div className="c-hand">
                {'Description '}
                {this.renderIcon('description', true)}
              </div>, 'description'],
              [<div className="c-hand">
                {'Datetime '}
                {this.renderIcon('datetime', false)}
              </div>, 'datetime'],
              [<div className="c-hand">
                {'Longitude '}
                {this.renderIcon('longitude', false)}
              </div>, 'longitude'],
              [<div className="c-hand">
                {'Latitude '}
                {this.renderIcon('latitude', false)}
              </div>, 'latitude'],
              [<div className="c-hand">
                {'Elevation '}
                {this.renderIcon('elevation', false)}
              </div>, 'elevation'],
              "Actions"
            ]}
            onHeadingClick={this.onHeadingClicked}
          />
          <thead>
          <tr>
            <td/><td/><td/><td/><td/><td/>
            <td>
              <Button as={Link} to="post" primary>Add Product</Button>
            </td>
          </tr>
            {
              products.slice(activePage-1, activePage + perPage - 1)
                .map(({_key: key, description, datetime, longitude, latitude, elevation}) =>
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{description}</td>
                    <td>{formatDate(datetime)}</td>
                    <td>{longitude}</td>
                    <td>{latitude}</td>
                    <td>{elevation}</td>
                    <td>
                      <Button.Group>
                        <Button as={Link} to={`/location/${key}`}>
                          View
                        </Button>
                        <Button as={Link} to={`/edit/${key}`}>
                          Edit
                        </Button>
                        <Button onClick={() => this.props.deleteLocation(key)}>
                          Delete
                        </Button>
                      </Button.Group>
                    </td>
                  </tr>
              )
            }
          </thead>
        </Table>
        {productsPagination}
      </Fragment>
    );
  }

  renderFilterOptions() {
    return(
      <Fragment>
        <div className="input-group form-group">
          <input type="text" className="form-input" onChange={e => this.setState(
              {query: _.toUpper(e.target.value)}
            )}
          />
          <Button primary inputGroup onClick={() => this.forceUpdate()}>
            Search
          </Button>
        </div>
      </Fragment>
    );
  }

  render() {
    return(
      <Fragment>
        {this.renderFilterOptions()}
        {this.renderLocations()}
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  const {products} = state;

  if(_.isArray(products)) {
    return {
      products: products.map(p => (
        {...p, ...p.locations.slice(-1)[0]}
      ))
    };
  }

  return {
    products
  };
}

export default connect(mapStateToProps, {getLocations: getProducts, deleteLocation: deleteProduct})(ProductsShow);