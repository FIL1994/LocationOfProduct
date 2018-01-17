/**
 * EditLocation.js
 *
 * @author Philip Van Raalte
 * @date 2018-01-15
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import _ from 'lodash';
import {Container} from 'semantic-ui-react';

import {getProduct, getLocation, editProduct} from '../../actions';
import ProductForm from '../ProductForm';
import DefaultLoader from '../DefaultLoader';
import DatetimeField from '../DatetimeField';

/**
 * A component for editing a location.
 */
class EditLocation extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  state = {
    submittingPost: false,
    gotLocation: false
  };

  componentDidMount() {
    const {id} = this.props.match.params;
    this.props.getProduct(id);
  }

  componentDidUpdate() {
    const {product} = this.props;

    // get location when product is accessible
    if(!_.isEmpty(product) && !this.state.gotLocation) {
      const {index} = this.props.match.params;
      this.props.getLocation(product, index);
      this.setState({gotLocation: true});
    }
  }

  onSubmit(values) {
    const {id, index} = this.props.match.params;
    values.datetime = values.time;
    values = _.omit(values, ["time"]);
    // clone locations and replace location
    let newLocations = [...this.props.product.locations];
    newLocations.splice(index, 1, values);

    this.setState({submittingPost: true});
    this.props.editProduct(
      id,
      {locations: newLocations},
      response => this.props.history.push(`/location/${this.props.match.params.id}`)
    );
  }

  render() {
    const {product, location: {datetime}} = this.props;

    if(!product) {
      return <DefaultLoader/>;
    }

    return(
      <Container>
        <ProductForm
          location
          onSubmit={this.props.handleSubmit(this.onSubmit)}
          submittingPost={this.state.submittingPost}
          cancelRoute={`/location/${this.props.match.params.id}`}
        >
          {
            datetime === undefined ? '' :
              <DatetimeField
                defaultValue={
                  (new Date(Number(datetime)))
                }
              />
          }
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

  if(datetime === undefined) {
    errors.time = "You must select a time";
  }

  return errors;
}

EditLocation = reduxForm({
  validate,
  form: 'EditLocationForm',
  enableReinitialize: true
})(EditLocation);

EditLocation = connect(
  state => ({
    initialValues: state.location,
    product: state.product,
    location: state.location
  }),
  {getProduct, getLocation, editProduct}
)(EditLocation);

export default EditLocation;