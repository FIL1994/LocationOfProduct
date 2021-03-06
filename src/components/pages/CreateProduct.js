/**
 * CreateProduct.js
 *
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import {Container, Divider} from 'semantic-ui-react';

import {createProducts} from '../../actions';
import ProductForm from '../ProductForm';
import DatetimeField from '../DatetimeField';

const formName = 'NewProductForm';
/**
 * A component for creating a product
 */
class CreateProduct extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  state = {
    submittingPost: false
  };

  onSubmit(values) {
    values.datetime = values.time;
    values = _.omit(values, ["time"]);
    // let the user know their request is being processed
    this.setState({submittingPost: true});

    this.props.createProducts(
      values,
      // callback to move the user back to the home page when the request has been processed
      response => this.props.history.push('/')
    );
  }

  render() {
    return (
      <Container>
        <h3 className="text-center">Create Product</h3>
        <Divider/>
        <ProductForm
          formName={formName}
          onSubmit={this.props.handleSubmit(this.onSubmit)}
          submittingPost={this.state.submittingPost}
        >
          <DatetimeField/>
        </ProductForm>
      </Container>
    );
  }
}

function validate(values) {
  const datetime = values.time;

  const {description, elevation, latitude, longitude} = values;
  let errors = {};

  if(!description || description.length < 3) {
    errors.description = "Enter a description that is at least 3 characters";
  }
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

  if(datetime === undefined) {
    errors.time = "You must select a time";
  }

  return errors;
}

export default reduxForm({
  validate,
  form: formName
})(
  connect(null, {createProducts})(CreateProduct)
);

