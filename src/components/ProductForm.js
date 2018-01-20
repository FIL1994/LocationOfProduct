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
import {Field} from 'redux-form';
import {Form, Button, Message} from 'semantic-ui-react';

import {tryCatch} from '../util';
import SelectLocationMap from './SelectLocationMap';
import {GOOGLE_MAPS_KEY} from '../config/keys';
import {changeFormField} from '../actions';

const defaultLat = 43.542;
const defaultLng = -80.242;

function renderField(field) {
  const {meta : {touched, error}} = field;
  const className = `form-group ${touched && error ? 'has-error' : ''}`;

  return(
    <div className={className}>
      <Form.Input
        fluid
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

// must be stateful so it doesn't loose focus on re-render
class LngInput extends Component {
  render() {
    return (
      <Form.Input
        fluid
        label={"Longitude: "}
        {...this.props.input}
      />
    );
  }
}

class LatInput extends Component {
  render() {
    return (
      <Form.Input
        fluid
        label={"Latitude: "}
        {...this.props.input}
      />
    );
  }
}

/**
 * A component for showing a form for a product
 * @param props
 * @returns {*}
 * @constructor
 */
class ProductForm extends Component {
  state = {
    lat: this.props.lat || defaultLat,
    lng: this.props.lng || defaultLng
  };

  onMapDrag = ({lat, lng}) => {
    this.setState({lat, lng});

    this.props.changeFormField(this.props.formName, 'latitude', _.toString(lat));
    this.props.changeFormField(this.props.formName, 'longitude', _.toString(lng));
  };

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
                label="Elevation: "
                name="elevation"
                component={renderField}
              />
              <Form.Group widths='equal'>
                <Field
                  name="latitude"
                  component={LatInput}
                  onChange={
                    ({target: {value}}) => this.setState({lat: value})
                  }
                />
                <Field
                  name="longitude"
                  component={LngInput}
                  onChange={
                    ({target: {value}}) => this.setState({lng: value})
                  }
                />
              </Form.Group>
              <div className="field">
                <label>Select Location:</label>
                <SelectLocationMap
                  apiKey={GOOGLE_MAPS_KEY}
                  onDrag={this.onMapDrag}
                  lat={
                    tryCatch(() => Number(this.state.lat) || defaultLat, defaultLat)
                  }
                  lng={
                    tryCatch(() => Number(this.state.lng) || defaultLng, defaultLng)
                  }
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