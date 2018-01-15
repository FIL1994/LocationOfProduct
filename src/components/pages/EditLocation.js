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

import {Page} from '../SpectreCSS';
import {getProduct, getLocation, editProduct} from '../../actions';
import ProductForm from '../ProductForm';

let SelectedDate;

class EditLocation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submittingPost: false,
      gotLocation: false
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const {id} = this.props.match.params;
    this.props.getProduct(id);
  }

  componentDidUpdate() {
    const {product} = this.props;

    if(!_.isEmpty(product) && !this.state.gotLocation) {
      const {index} = this.props.match.params;
      this.props.getLocation(product, index);
      this.setState({gotLocation: true});
    }
  }

  onSubmit(values) {
    const {id, index} = this.props.match.params;
    values.datetime = moment(SelectedDate.state.inputValue).toDate().getTime();
    // clone locations and replace location
    let newLocations = [...this.props.product.locations];
    newLocations.splice(index, 1, values);
    console.log(newLocations);

    this.setState({submittingPost: true});
    this.props.editProduct(id, {locations: newLocations}, response => this.props.history.push('/'));
  }

  render() {
    const {location: {datetime}} = this.props;

    return(
      <Page centered>
        <ProductForm
          location
          onSubmit={this.props.handleSubmit(this.onSubmit)}
          submittingPost={this.state.submittingPost}
          cancelRoute={`/location/${this.props.match.params.id}`}
        >
          {
            datetime !== undefined ? '' :
              <Field
                name="time"
                component={field => {
                  const {meta: {error}} = field;
                  const className = `form-group ${error ? 'has-error' : ''}`;

                  return (
                    <div className={className}>
                      <label>Datetime: </label>
                      <Datetime
                        isValidDate={currentDate => moment(Date.now()).isAfter(currentDate)}
                        ref={(datetime) => SelectedDate = datetime}
                        defaultValue={
                          (new Date(Number(datetime)))
                        }
                      />
                      <div className="form-input-hint">
                        {error}
                      </div>
                    </div>
                  );
                }}
              />
          }
        </ProductForm>
      </Page>
    );
  }
}

function validate(values) {
  const datetime =(() => {
    try {
      return moment(SelectedDate.state.inputValue).toDate().getTime();
    } catch (e) {
      return undefined;
    }
  })();

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

EditLocation = reduxForm({
  validate,
  form: 'EditLocationForm',
  enableReinitialize: true
})(EditLocation);

EditLocation = connect(
  state => ({
    initialValues: state.location,
    product: state.product,
    location: state.location
  }),
  {getProduct, getLocation, editProduct}
)(EditLocation);

export default EditLocation;