/**
 * CreateLocation.js
 *
 * @author Philip Van Raalte
 * @date 2018-01-15
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import _ from 'lodash';
import {Container, Divider} from 'semantic-ui-react';

import {getProduct, editProduct} from '../../actions';
import ProductForm from '../ProductForm';
import DefaultLoader from '../DefaultLoader';
import DatetimeField from '../DatetimeField';

/**
 * A component for creating a location and adding it to a product
 */
class CreateLocation extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  state = {
    submittingPost: false
  };

  componentDidMount() {
    const {id} = this.props.match.params;
    this.props.getProduct(id);
  }

  onSubmit(values) {
    const {id} = this.props.match.params;
    // get the unix time from the date picker
    values.datetime = values.time;
    values = _.omit(values, ["time"]);
    // let the user know their request is being processed
    this.setState({submittingPost: true});

    this.props.editProduct(
      id,
      // appending new location to the product's location list
      {locations: [...this.props.product.locations, values]},
      // callback to move the user back to the product details when the request has been processed
      response => this.props.history.push(`/location/${this.props.match.params.id}`)
    );
  }

  render() {
    if(!this.props.product) {
      return <DefaultLoader/>;
    }

    return (
      <Container>
        <h3 className="text-center">Create Location</h3>
        <Divider/>
        <ProductForm
          location
          onSubmit={this.props.handleSubmit(this.onSubmit)}
          submittingPost={this.state.submittingPost}
          cancelRoute={`/location/${this.props.match.params.id}`}
        >
          <DatetimeField/>
        </ProductForm>
      </Container>
    );
  }
}

function validate(values) {
  const datetime = values.time;

  const {elevation, latitude, longitude} = values;
  let errors = {};

  if(!elevation) {
    errors.elevation = "Enter an elevation";
  } else if(!_.isFinite(Number(elevation))) {
    errors.elevation = "Elevation must be a number";
  }
  if(!latitude) {
    errors.latitude = "Enter a latitude";
  } else if(!_.isFinite(Number(latitude))) {
    errors.latitude = "Latitude must be a number";
  } else if(Number(latitude) > 85 || Number(latitude) < -85) {
    errors.latitude = "Must be between -85 and 85";
  }
  if(!longitude) {
    errors.longitude = "Enter a longitude";
  } else if(!_.isFinite(Number(longitude))) {
    errors.longitude = "Longitude must be a number";
  } else if(Number(longitude) > 180 || Number(longitude) < -180) {
    errors.longitude = "Must be between -180 and 180";
  }

  if(!_.isFinite(datetime)) {
    errors.time = "You must select a time";
  }

  return errors;
}

CreateLocation = reduxForm({
  validate,
  form: 'CreateLocationForm'
})(CreateLocation);

CreateLocation = connect(
  state => ({
    product: state.product
  }),
  {getProduct, editProduct}
)(CreateLocation);

export default CreateLocation;