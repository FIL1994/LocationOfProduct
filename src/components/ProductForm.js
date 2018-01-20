/**
 * ProductForm.js
 *
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import {Field, change} from 'redux-form';
import {Form, Button, Message} from 'semantic-ui-react';

import SelectLocationMap from './SelectLocationMap';
import {GOOGLE_MAPS_KEY} from '../config/keys';
import {changeFormField} from '../actions';

function renderField(field) {
  const {meta : {touched, error}} = field;
  const className = `form-group ${touched && error ? 'has-error' : ''}`;

  return(
    <div className={className}>
      <Form.Input
        label={field.label}
        placeholder={field.input.name}
        {...field.input}
        error={Boolean(touched && error)}
      />
      {
        touched
          ?
            <Message error content={error}/>
          :
            ''
      }
    </div>
  );
}

/**
 * A component for showing a form for a product
 * @param props
 * @returns {*}
 * @constructor
 */
class ProductForm extends Component {
  state = {
    lat: this.props.lat || 43.542,
    lng: this.props.lng || -80.242
  };

  componentDidUpdate() {
    this.props.changeFormField(this.props.formName, 'latitude', _.toString(this.state.lat));
    this.props.changeFormField(this.props.formName, 'longitude', _.toString(this.state.lng));
  }

  render() {
    const {edit, location, cancelRoute, submittingPost, children} = this.props;

    return (
      <Form error
        {..._.omit(
          this.props,
          [
            'submittingPost', 'edit', 'location', 'cancelRoute', 'children', 'lat', 'lng', 'formName', 'changeFormField'
          ]
        )}
      >
        {
          location ? '' :
            <Field
              label="Description: "
              name="description"
              component={renderField}
            />
        }
        {
          edit ? '' :
            <Fragment>
              <Field
                label="Latitude: "
                name="latitude"
                component={renderField}
                onChange={({target: {value}}) => this.setState({lat: Number(value)})}
              />
              <Field
                label="Longitude: "
                name="longitude"
                component={renderField}
                onChange={({target: {value}}) => this.setState({lng: Number(value)})}
              />
              <Field
                label="Elevation: "
                name="elevation"
                component={renderField}
              />
              <div className="field">
                <label>Select Location:</label>
                <SelectLocationMap
                  apiKey={GOOGLE_MAPS_KEY}
                  onDrag={({lat, lng}) => this.setState({lat, lng})}
                  lat={this.state.lat}
                  lng={this.state.lng}
                />
              </div>
            </Fragment>
        }
        {children}
        <div style={{marginTop: 5}}/>
        <Button.Group fluid>
          <Button type="submit" primary loading={submittingPost}>
            Submit
          </Button>
          <Button as={Link} to={cancelRoute} color='red'>
            Cancel
          </Button>
        </Button.Group>
      </Form>
    );
  }
}

ProductForm.propTypes = {
  cancelRoute: PropTypes.string.isRequired,
  formName: PropTypes.string.isRequired,
  lat: PropTypes.number,
  lng: PropTypes.number
};

ProductForm.defaultProps = {
  cancelRoute: "/"
};

export default connect(null, {changeFormField})(ProductForm);