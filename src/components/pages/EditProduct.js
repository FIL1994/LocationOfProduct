/**
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import _ from 'lodash';

import {Page} from '../SpectreCSS';
import {getProduct, editProduct} from '../../actions';
import ProductForm from '../ProductForm';

class EditProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submittingPost: false
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const {id} = this.props.match.params;
    this.props.getLocation(id);
  }

  onSubmit(values) {
    this.setState({submittingPost: true});

    values = _.omit(values, ['_key', 'locations']);

    const {id} = this.props.match.params;
    this.props.editLocation(id, values, response => this.props.history.push('/'));
  }

  render() {
    return (
      <Page centered>
        <ProductForm edit onSubmit={this.props.handleSubmit(this.onSubmit)} submittingPost={this.state.submittingPost}/>
      </Page>
    );
  }
}

function validate(values) {
  const {description} = values;
  let errors = {};

  if(!description || description.length < 3) {
    errors.description = "Enter a description that is at least 3 characters";
  }

  return errors;
}

EditProduct = reduxForm({
  validate,
  form: 'EditLocationForm',
  enableReinitialize: true
})(EditProduct);

EditProduct = connect(
  state => ({
    initialValues: _.omit(state.product, ["_id", "_rev", "latitude", "longitude", "elevation"])
  }),
  {getLocation: getProduct, editLocation: editProduct}
)(EditProduct);

export default EditProduct;