/**
 * EditProduct.js
 *
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {reduxForm} from 'redux-form';
import _ from 'lodash';
import {Container, Button} from 'semantic-ui-react';

import {getProduct, editProduct} from '../../actions';
import ProductForm from '../ProductForm';
import DefaultLoader from '../DefaultLoader';

/**
 * A component for editing a product
 */
class EditProduct extends Component {
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
    // let the user know their request is being processed
    this.setState({submittingPost: true});

    // remove unnecessary props
    values = _.omit(values, ['_key', 'locations']);

    const {id} = this.props.match.params;
    this.props.editProduct(id, values, response => this.props.history.push('/'));
  }

  render() {
    if(!this.props.product) {
      return <DefaultLoader/>;
    }

    return (
      <Container>
        <ProductForm
          edit
          onSubmit={this.props.handleSubmit(this.onSubmit)}
          submittingPost={this.state.submittingPost}
        >
          <div className="form-group">
            <Button as={Link} to={`/location/${this.props.match.params.id}`} fluid>View Locations</Button>
          </div>
        </ProductForm>
      </Container>
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
  form: 'EditProductForm',
  enableReinitialize: true
})(EditProduct);

EditProduct = connect(
  state => ({
    // remove unnecessary props
    initialValues: _.omit(state.product, ["_id", "_rev", "latitude", "longitude", "elevation"]),
    product: state.product
  }),
  {getProduct, editProduct}
)(EditProduct);

export default EditProduct;