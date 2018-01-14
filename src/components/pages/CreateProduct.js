/**
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {reduxForm, Field} from 'redux-form';
import InputMoment from 'input-moment';
import moment from 'moment';

import {Page} from '../SpectreCSS';
import {createProducts} from '../../actions';
import ProductForm from '../ProductForm';

let time = undefined;

class CreateProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submittingPost: false,
      m: moment()
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
        <ProductForm onSubmit={this.props.handleSubmit(this.onSubmit)} submittingPost={this.state.submittingPost}>
          <Field
            name="time"
            component={field => {
              const {meta : {error}} = field;
              const className = `form-group ${error ? 'has-error' : ''}`;

              return (
                <div className={className}>
                  <InputMoment
                    moment={this.state.m}
                    onChange={m => {
                      time = new Date(m).getTime();
                      console.log("time", time);
                      this.setState({m});
                    }}
                    minStep={1}
                    onSave={() => console.log('saved', this.state.m.format('1111'))}
                    prevMonthIcon="fa fa-caret-left"
                    nextMonthIcon="fa fa-caret-right"
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
  console.log("TIME", time);

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

  if(time !== undefined) {
    if(!_.isFinite(time)) {
      errors.time = "Invalid time";
    } else if(time > Date.now()) {
      errors.time = "You cannot select a date in the future";
    }
  }

  return errors;
}

export default reduxForm({
  validate,
  form: 'NewLocationForm'
})(
  connect(null, {createLocation: createProducts})(CreateProduct)
);

