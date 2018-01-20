/**
 * DefaultLoader.js
 *
 * @author Philip Van Raalte
 * @date 2018-01-16
 */
import React, {Component, Fragment} from 'react';
import {Loader} from 'semantic-ui-react';
import _ from 'lodash';

/**
 * A Semantic-UI Loader with custom default props.
 * Defaults to only showing the loader after 1 second.
 * Showing the loader immediately can cause the user to perceive the app to be slower.
 *
 * @param props
 * @returns {*}
 */
class DefaultLoader extends Component {
  state = {
    show: this.props.show
  };

  static defaultProps = {
    show: false,
    millisecondsToShow: 1000
  };

  timeout;

  componentDidMount() {
    if(!this.props.show) {
      this.timeout = setTimeout(
        () => this.setState({show: true}),
        this.props.millisecondsToShow
      )
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    const myProps = _.omit(this.props, ["show", "millisecondsToShow"]);
    const {show} = this.state;

    if(!show) {
      return '';
    }

    return(
      <Fragment>
        <div style={{marginTop: 50}}/>
        <Loader indeterminate={true} size="large" active content='Loading' {...myProps}/>
      </Fragment>
    );
  }
}

export default DefaultLoader;