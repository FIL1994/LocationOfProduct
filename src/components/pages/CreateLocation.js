/**
 * @author Philip Van Raalte
 * @date 2018-01-15
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm, Field} from 'redux-form';
import _ from 'lodash';
import Datetime from 'react-datetime';
import moment from 'moment';

import {Loading, Page} from '../SpectreCSS';
import {getProduct, editProduct} from '../../actions';
import ProductForm from '../ProductForm';
import tryCatch from '../../util/tryCatch';

let selectedDate;

class CreateLocation extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  state = {
    submittingPost: false
  };

  componentDidMount() {
    const {id} = this.props.match.params;
    this.props.getProduct(id);
  }

  onSubmit(values) {
    const {id} = this.props.match.params;
    values.datetime = moment(selectedDate.state.inputValue).toDate().getTime();

    this.setState({submittingPost: true});
    this.props.editProduct(
      id,
      {locations: [...this.props.product.locations, values]},
      response => this.props.history.push(`/location/${this.props.match.params.id}`)
    );
  }

  render() {
    if(!this.props.product) {
      return <Page centered><Loading large/></Page>;
    }

    return (
      <Page centered>
        <ProductForm
          location
          onSubmit={this.props.handleSubmit(this.onSubmit)}
          submittingPost={this.state.submittingPost}
          cancelRoute={`/location/${this.props.match.params.id}`}
        >
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
                    defaultValue={Date.now()}
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

CreateLocation = reduxForm({
  validate,
  form: 'CreateLocationForm'
})(CreateLocation);

CreateLocation = connect(
  state => ({
    product: state.product
  }),
  {getProduct, editProduct}
)(CreateLocation);

export default CreateLocation;