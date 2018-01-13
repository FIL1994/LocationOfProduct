/**
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';

import {Page, Button} from '../SpectreCSS';
import {createLocation} from '../../actions';

class CreateLocation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submittingPost: false
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  renderField(field) {
    const {meta : {touched, error}} = field;
    const className=`form-group ${touched && error ? 'has-error' : ''}`;
    return(
      <div className={className}>
        <label htmlFor={field.input.name}>{field.label}</label>
        <input
          className="form-input"
          id={field.input.name}
          placeholder={field.input.name}
          {...field.input}
        />
        <div className="form-input-hint">
          {touched ? error : ''}
        </div>
      </div>
    );
  }

  onSubmit(values) {
    this.setState({submittingPost: true});

    this.props.createLocation(values, response => this.props.history.push('/'));
  }

  render() {
    return (
      <Page centered>
        <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
          <Field
            label="Description: "
            name="description"
            component={this.renderField}
          />
          <Field
            label="Longitude: "
            name="longitude"
            component={this.renderField}
          />
          <Field
            label="Latitude: "
            name="latitude"
            component={this.renderField}
          />
          <Field
            label="Elevation: "
            name="elevation"
            component={this.renderField}
          />
          <Field
            label="Datetime: "
            name="datetime"
            component={this.renderField}
          />
          <Button.Group block>
            <Button type="submit" primary loading={this.state.submittingPost}>
              Submit
            </Button>
            <Button as={Link} to="/" error>
              Cancel
            </Button>
          </Button.Group>
        </form>
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
  connect(null, {createLocation})(CreateLocation)
);

