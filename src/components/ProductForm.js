/**
 * ProductForm.js
 *
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import React, {Fragment} from 'react';
import {Link} from "react-router-dom";
import {Field} from 'redux-form';
import {Form, Button, Message} from 'semantic-ui-react';

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
let ProductForm = (props) => {
  const {edit, location, cancelRoute} = props;

  return(
    <Form error {..._.omit(props, 'submittingPost', 'edit', 'location', 'cancelRoute')}>
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
              label="Longitude: "
              name="longitude"
              component={renderField}
            />
            < Field
              label="Latitude: "
              name="latitude"
              component={renderField}
            />
            <Field
              label="Elevation: "
              name="elevation"
              component={renderField}
            />
          </Fragment>
      }
      {props.children}
      <div style={{marginTop: 5}}/>
      <Button.Group fluid>
        <Button type="submit" primary loading={props.submittingPost}>
          Submit
        </Button>
        <Button as={Link} to={cancelRoute} color='red'>
          Cancel
        </Button>
      </Button.Group>
    </Form>
  );
};

ProductForm.defaultProps = {
  cancelRoute: "/"
};

export default ProductForm;