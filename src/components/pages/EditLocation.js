/**
 * EditLocation.js
 *
 * @author Philip Van Raalte
 * @date 2018-01-15
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm, Field} from 'redux-form';
import _ from 'lodash';
import Datetime from 'react-datetime';
import moment from 'moment';
import {Container} from 'semantic-ui-react';

import {getProduct, getLocation, editProduct} from '../../actions';
import ProductForm from '../ProductForm';
import tryCatch from '../../util/tryCatch';
import DefaultLoader from '../DefaultLoader';

let selectedDate;

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
    // get the unix time from the date picker
    values.datetime = moment(selectedDate.state.inputValue).toDate().getTime();
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
              <Field
                name="time"
                component={field => {
                  const {meta: {error}} = field;
                  const className = `form-group ${error ? 'has-error' : ''}`;

                  return (
                    <div className={className}>
                      <label>Datetime: </label>
                      <Datetime
                        inputProps={{className: "form-input"}}
                        isValidDate={currentDate => moment(Date.now()).isAfter(currentDate)}
                        ref={(datetime) => selectedDate = datetime}
                        defaultValue={
                          (new Date(Number(datetime)))
                        }
                      />
                      <div className="form-input-hint">
                        {error}
                      </div>
                    </div>
                  );
                }}
              />
          }
        </ProductForm>
      </Container>
    );
  }
}

function validate(values) {
  // the date picker does not integrate w/ Redux Form so manually get the date
  const datetime = tryCatch(
    () => moment(selectedDate.state.inputValue).toDate().getTime()
  );

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