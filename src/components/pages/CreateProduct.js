/**
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {reduxForm, Field} from 'redux-form';
import Datetime from 'react-datetime';
import moment from 'moment';

import {Page} from '../SpectreCSS';
import {createProducts} from '../../actions';
import ProductForm from '../ProductForm';

let SelectedDate;

class CreateProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submittingPost: false
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(values) {
    values.datetime = SelectedDate.state.inputValue;
    this.setState({submittingPost: true});

    this.props.createLocation(values, response => this.props.history.push('/'));
  }

  render() {
    return (
      <Page centered>
        <ProductForm onSubmit={this.props.handleSubmit(this.onSubmit)} submittingPost={this.state.submittingPost}>
          <Field
            name="time"
            component={field => {
              const {meta : {error}} = field;
              const className = `form-group ${error ? 'has-error' : ''}`;

              return (
                <div className={className}>
                  <Datetime
                    isValidDate={currentDate => moment(Date.now()).isAfter(currentDate)}
                    ref={(datetime) => SelectedDate = datetime}
                  />
                  <div className="form-input-hint">
                    {error}
                  </div>
                </div>
              );
            }}
          />
        </ProductForm>
      </Page>
    );
  }
}

function validate(values) {
  const datetime = () => {
    try {
      return SelectedDate.state.inputValue;
    } catch (e) {
      return undefined;
    }
  };

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
    errors.latitude = "Enter an latitude";
  } else if(!_.isFinite(Number(latitude))) {
    errors.latitude = "Latitude must be a number";
  } else if(Number(latitude) > 85 || Number(latitude) < -85) {
    errors.latitude = "Must be between -85 and 85";
  }
  if(!longitude) {
    errors.longitude = "Enter an longitude";
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
  form: 'NewLocationForm'
})(
  connect(null, {createLocation: createProducts})(CreateProduct)
);

