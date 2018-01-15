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
  componentDidMount() {
    this.props.getLocations();
  }

  renderLocations() {
    const {products} = this.props;

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

  render() {
    return(
      <Fragment>
        <h3>Products</h3>
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