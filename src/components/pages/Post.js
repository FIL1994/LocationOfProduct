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

class Post extends Component {
  constructor(props) {
    super(props);

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
    console.log(values);
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
        </form>
        <Button.Group block>
          <Button type="submit" primary>
            Submit
          </Button>
          <Button as={Link} to="/" error>
            Cancel
          </Button>
        </Button.Group>
      </Page>
    );
  }
}

function validate(values) {
  console.log("values", values);
  let errors = {};

  return errors;
}

export default reduxForm({
  validate,
  form: 'PostNewLocationForm'
})(
  connect(null, {createLocation})(Post)
);

