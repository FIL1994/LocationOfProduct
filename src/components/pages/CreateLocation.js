/**
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';

import {Page} from '../SpectreCSS';
import {createProducts} from '../../actions';
import ProductForm from '../ProductForm';

class CreateProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submittingPost: false
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(values) {
    this.setState({submittingPost: true});

    this.props.createLocation(values, response => this.props.history.push('/'));
  }

  render() {
    return (
      <Page centered>
        <ProductForm onSubmit={this.props.handleSubmit(this.onSubmit)} submittingPost={this.state.submittingPost}/>
      </Page>
    );
  }
}

function validate(values) {
  const {description, elevation, latitude, longitude} = values;
  let errors = {};

  if(!description || description.length < 3) {
    errors.description = "Enter a description that is at least 3 characters";
  }
  if(!elevation) {
    errors.elevation = "Enter an elevation";
  }
  if(!latitude) {
    errors.latitude = "Enter an latitude";
  }
  if(!longitude) {
    errors.longitude = "Enter an longitude";
  }

  return errors;
}

export default reduxForm({
  validate,
  form: 'NewLocationForm'
})(
  connect(null, {createLocation: createProducts})(CreateProduct)
);

