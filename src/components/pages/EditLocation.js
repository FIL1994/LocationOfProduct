/**
 * @author Philip Van Raalte
 * @date 2018-01-13
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';

import {Page} from '../SpectreCSS';
import {getLocation, editLocation} from '../../actions';
import LocationForm from '../LocationForm';

class EditLocation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submittingPost: false
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const {id} = this.props.match.params;
    this.props.getLocation(id);
  }

  onSubmit(values) {
    this.setState({submittingPost: true});

    const {id} = this.props.match.params;
    this.props.editLocation(id, values, response => this.props.history.push('/'));
  }

  render() {
    return (
      <Page centered>
        <LocationForm onSubmit={this.props.handleSubmit(this.onSubmit)} submittingPost={this.state.submittingPost}/>
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

EditLocation = reduxForm({
  validate,
  form: 'EditLocationForm',
  enableReinitialize: true
})(EditLocation);

EditLocation = connect(
  state => ({
    initialValues: _.omit(state.location, ["_id", "_rev"])
  }),
  {getLocation, editLocation}
)(EditLocation);

export default EditLocation;