/** @license GPL-3.0
 * SpectreCSS.js
 *
 * @author: Philip Van Raalte
 * @date November 8, 2017
 *
 * Functional components for the Spectre CSS library.
 */
import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

/**
 * Prepends the className from props to the component default className.
 * @param {String} defaultClass The default class for the component.
 * @param {String} newClass The class name to prepend to the default class. (So the default class will override it)
 * @returns {String} JSX Component
 */
function addClass(defaultClass, newClass) {
  return `${_.isString(newClass) ? newClass : ''} ${defaultClass}`.trim();
}

/**
 * A simple button.
 * @param {Object} props Properties for the component.
 * @returns {XML} JSX Component
 * @constructor
 */
let Button = (props) => {
  const {small, large, block, primary, centered, disabled, success, error, loading, link, inputGroup} = props;
  let className = "btn";
  let otherProps = {};

  // allow size to be passed as a string or a number
  if(!_.isEmpty(props.size) || _.isNumber(props.size)) {
    className = `${className} col-${props.size.toString().trim()}`;
  }

  if(large) {
    className = addClass(className, "btn-lg");
  } else if(small) {
    className = addClass(className, "btn-sm");
  }

  if(block) {
    className = addClass(className, "btn-block");
  }

  if(primary) {
    className = addClass(className, "btn-primary");
  }

  if(success) {
    className = addClass(className, "btn-success");
  }

  if(error) {
    className = addClass(className, "btn-error");
  }

  if(link) {
    className = addClass(className, "btn-link")
  }

  if(loading) {
    className = addClass(className, "loading");
  }

  if(centered) {
    className = addClass(className, "centered text-center");
  }

  if(inputGroup) {
    className = addClass(className, "input-group-btn");
  }

  if(disabled) {
    otherProps.disabled = true;
    otherProps.tabIndex = "-1";
    className = addClass(className, "disabled");
  }

  // add the className prop to the className
  className = addClass(className, props.className);

  // remove unnecessary props
  let myProps = _.omit(props,
    ['small', 'large', 'block', 'primary', 'centered', 'disabled', 'as', 'success', 'error', 'loading', 'link',
      'inputGroup']
  );

  return <props.as {...myProps} {...otherProps} className={className}/>;
};

Button.defaultProps = {
  as: (props) => <button type="button" {...props}/> // type defaults to "button" if no component is provided in props
};

Button.Group = (props) => {
  const {block} = props;
  let className = "btn-group";

  if(block) {
    className = addClass(className, "btn-group-block");
  }

  // add the className prop to the className
  className = addClass(className, props.className);

  // remove unnecessary props
  let myProps = _.omit(props, ['block']);

  return <div {...myProps} className={className} />;
};

export {Button};

/**
 * A divider for separating elements.
 * @param {Object} props Properties for the component.
 * @returns {XML} JSX Component
 * @constructor
 */
export const Divider = (props) => {
  // add the className prop to the className
  let className = addClass("divider", props.className);

  // allow size to be passed as a string or a number
  if(!_.isEmpty(props.size) || _.isNumber(props.size)) {
    className = addClass(className, `col-${props.size.toString().trim()} centered`);
  }

  return <div {...props} className={className}/>;
};

/**
 * A loading indicator.
 * @param {Object} props Properties for the component.
 * @returns {XML} JSX Component
 * @constructor
 */
export const Loading = (props) => {
  const {large} = props;
  let className = "loading";

  if(large) {
    className = addClass(className, "loading-lg");
  }

  // add the className prop to the className
  className = addClass(className, props.className);

  // remove unnecessary props
  let myProps = _.omit(props, ['large']);

  return <div {...myProps} className={className}/>;
};

/**
 * A page for containing elements.
 * @param {Object} props Properties for the component.
 * @returns {XML} JSX Component
 * @constructor
 */
export const Page = (props) => {
  const {centered} = props;
  // add the className prop to the className
  let className = addClass("page container", props.className);

  if(centered) {
    className = addClass(className, "centered text-center");
  }

  // remove unnecessary props
  let myProps = _.omit(props, ['centered']);

  return <div {...myProps} className={className}/>;
};

/**
 * A table for a data set
 * @param {Object} props Properties for the component.
 * @returns {XML} JSX Component
 * @constructor
 */
const Table = (props) => {
  const {striped, hover, centered} = props;
  // add the className prop to the className
  let className = addClass("table", props.className);

  if(striped) {
    className = addClass(className, "table-striped")
  }

  if(hover) {
    className = addClass(className, "table-hover")
  }

  if(centered) {
    className = addClass(className, "text-center")
  }

  // add the className prop to the className
  className = addClass(className, props.className);

  // remove unnecessary props
  let myProps = _.omit(props, ['striped', 'hover', 'centered']);

  return <table {...myProps} className={className}/>;
};

Table.Head = (props) => {
  const {headings} = props;

  // remove unnecessary props
  let myProps = _.omit(props, ['headings']);

  return (
    <thead {...myProps}>
      <tr>
        {headings.map(h => <th key={h}>{h}</th>)}
      </tr>
    </thead>
  );
};

Table.Head.propTypes = {
  headings: PropTypes.array.isRequired
};

Table.Body = (props) => {
  return <tbody {...props}/>;
};

Table.Row = (props) => {
  return <tr {...props}/>;
};

export {Table};

/**
 * A tab for switching between views
 * @param {Object} props Properties for the component.
 * @returns {XML} JSX Component
 * @constructor
 */
const Tab = (props) => {
  const {block} = props;
  // add the className prop to the className
  let className = addClass("tab", props.className);

  if(block) {
    className = addClass(className, "tab-block")
  }

  // add the className prop to the className
  className = addClass(className, props.className);

  // remove unnecessary props
  let myProps = _.omit(props, ['block']);

  return <ul {...myProps} className={className}/>;
};

Tab.Heading = (props) => {
  const {active} = props;
  // add the className prop to the className
  let className = addClass("tab-item", props.className);

  if(active) {
    className = addClass(className, "active");
  }

  // add the className prop to the className
  className = addClass(className, props.className);

  // remove unnecessary props
  let myProps = _.omit(props, ['active']);

  return <li {...myProps} className={className}/>;
};

export {Tab};

/**
 * A toast to show an alert or information.
 * @param {Object} props Properties for the component.
 * @returns {XML} JSX Component
 * @constructor
 */
export const Toast = (props) => {
  const {primary, centered} = props;
  // add the className prop to the className
  let className = addClass("toast", props.className);

  if(primary) {
    className = addClass(className, "btn-primary");
  }

  if(centered) {
    className = addClass(className, "centered text-center");
  }

  // remove unnecessary props
  let myProps = _.omit(props, ['primary', 'centered']);

  return <div {...myProps} className={className}/>;
};

/**
 * A hover parallax effect.
 * @param {Object} props Properties for the component.
 * @returns {XML} JSX Component
 * @constructor
 */
export const Parallax = (props) => {
  const {children, title, topLeft, topRight, bottomLeft, bottomRight} = props;

  // add the className prop to the className
  let className = addClass("parallax", props.className);

  // remove unnecessary props
  let myProps = _.omit(props, ['children', 'title', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight']);

  return (
    <div {...myProps} className={className}>
      <div className="parallax-top-left" onClick={topLeft}/>
      <div className="parallax-top-right" onClick={topRight}/>
      <div className="parallax-bottom-left" onClick={bottomLeft}/>
      <div className="parallax-bottom-right" onClick={bottomRight}/>
      <div className="parallax-content">
        <div className="parallax-front">
          <h2>{title}</h2>
        </div>
        <div className="parallax-back">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * A flexible view container with an auto-expand content section.
 * @param {Object} props Properties for the component.
 * @returns {XML} JSX Component
 * @constructor
 */
export const Panel = (props) => {
  const {children, title, footer} = props;

  // add the className prop to the className
  let className = addClass("panel", props.className);

  // remove unnecessary props
  let myProps = _.omit(props, ['children', 'title', 'footer']);

  let header =_.isEmpty(title) ? <Fragment/> : (
    <div className="panel-header">
      <div className="panel-title">
        <h5>{title}</h5>
      </div>
    </div>
  );

  return (
    <div {...myProps} className={className}>
      {header}
      <div className="panel-body">
        {children}
      </div>
      <div className="panel-footer">
        {footer}
      </div>
    </div>
  );
};

/**
 * A placeholder for first time use, empty data and error screens.
 * @param {Object} props Properties for the component.
 * @returns {XML} JSX Component
 * @constructor
 */
export const EmptyState = (props) => {
  const {children, title, icon} = props;

  // add the className prop to the className
  let className = addClass("empty", props.className);

  // remove unnecessary props
  let myProps = _.omit(props, ['children', 'title', 'icon']);

  return(
    <div {...myProps} className={className}>
      {
        _.isEmpty(icon)
          ?
          ''
          :
          <div className="empty-icon">
            {icon}
          </div>
      }
      <div className="empty-title h5">{title}</div>
      <div className="empty-action">
        {children}
      </div>
    </div>
  );
};