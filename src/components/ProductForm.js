/**
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import React, {Fragment} from 'react';
import {Link} from "react-router-dom";
import {Field} from 'redux-form';
import {Button} from './SpectreCSS';

function renderField(field) {
  const {meta : {touched, error}} = field;
  const className = `form-group ${touched && error ? 'has-error' : ''}`;
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

let ProductForm = (props) => {
  const {edit, location, cancelRoute} = props;

  return(
    <form {..._.omit(props, 'submittingPost', 'edit', 'location', 'cancelRoute')}>
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
      <Button.Group block>
        <Button type="submit" primary loading={props.submittingPost}>
          Submit
        </Button>
        <Button as={Link} to={cancelRoute} error>
          Cancel
        </Button>
      </Button.Group>
    </form>
  );
};

ProductForm.defaultProps = {
  cancelRoute: "/"
};

export default ProductForm;