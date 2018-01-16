/**
 * CreateProduct.js
 *
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm, Field} from 'redux-form';
import Datetime from 'react-datetime';
import moment from 'moment';
import {Container} from 'semantic-ui-react';

import {createProducts} from '../../actions';
import ProductForm from '../ProductForm';
import tryCatch from '../../util/tryCatch';

let selectedDate;

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
    // get the unix time from the date picker
    values.datetime = moment(selectedDate.state.inputValue).toDate().getTime();
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
        <ProductForm
          onSubmit={this.props.handleSubmit(this.onSubmit)}
          submittingPost={this.state.submittingPost}
        >
          <Field
            name="time"
            component={field => {
              const {meta : {error}} = field;
              const className = `form-group ${error ? 'has-error' : ''}`;

              return (
                <div className={className}>
                  <label>Datetime: </label>
                  <Datetime
                    inputProps={{className: "form-input"}}
                    isValidDate={currentDate => moment(Date.now()).isAfter(currentDate)}
                    ref={(datetime) => selectedDate = datetime}
                  />
                  <div className="form-input-hint">
                    {error}
                  </div>
                </div>
              );
            }}
          />
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
  form: 'NewProductForm'
})(
  connect(null, {createProducts})(CreateProduct)
);

