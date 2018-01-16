/**
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import React, {Component, Fragment} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import _ from 'lodash';

import {Button, EmptyState, Loading, Table} from './SpectreCSS';
import {getProducts, deleteProduct} from '../actions';
import formatDate from '../util/formatDate';

class ProductsShow extends Component {
  state = {
    query: undefined,
    products: undefined
  };

  componentDidMount() {
    this.props.getLocations();
  }

  filterProducts(products) {
    if(products === undefined) {
      return undefined;
    }
    const {query} = this.state;

    if(_.isEmpty(query)) {
      return products;
    }

    let productsToReturn = [...products];

    productsToReturn = _.compact(productsToReturn.map(p => {
      let send = false;

      const objectEntries = Object.entries(p);
      for (let i in objectEntries) {
        const [, value] = objectEntries[i];
        if(_.toUpper(value).includes(query)) {
          send = true;
          break;
        }
      }

      return send ? p : false;
    }));


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

    return(
      <Table centered striped hover>
        <Table.Head headings={["ID", "Description", "Datetime", "Longitude", "Latitude", "Elevation", "Actions"]}/>
        <thead>
          {
            products.map(({_key: key, description, datetime, longitude, latitude, elevation}) =>
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
    );
  }

  renderFilterOptions() {
    return(
      <Fragment>
        <div className="input-group form-group">
          <input type="text" className="form-input" onChange={e => this.setState(
            {query: _.toUpper(e.target.value)}
            )}/>
          <Button primary inputGroup>
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