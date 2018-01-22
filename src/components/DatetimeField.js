/**
 * @author Philip Van Raalte
 * @date 2018-01-16
 */
import React, {Component} from 'react';
import {Field} from 'redux-form';
import Datetime from 'react-datetime';
import moment from 'moment';
import {Message, Form} from 'semantic-ui-react';
import tryCatch from '../util/tryCatch';

let fieldInput;
/**
 * A Datetime component that works with ReduxForm
 */
export default (props) => {
    return (
        <Datetime
          {...props}
          renderInput={
            (inputProps, openCalendar) => (
              <Field
                name="time"
                component={field => {
                  const {meta: {touched, error}} = field;
                  const className = `form-group ${touched && error ? 'error field' : ''}`;

                  fieldInput = field.input;

                  return(
                    <div className={className}>
                      <Form.Input
                        {...field.input}
                        {...inputProps}
                        label="Datetime: "
                        placeholder="click to pick a date"
                        error={Boolean(touched && error)}
                        onClick={(e) => {
                          inputProps.onClick(e);
                          field.input.onClick(e);
                        }}
                        onChange={(e) => {
                          inputProps.onChange(e);
                          field.input.onChange(e);
                        }}
                        onFocus={(e) => {
                          inputProps.onFocus(e);
                          field.input.onFocus(e);
                        }}
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
                }}
              />
            )
          }
          inputProps={{className: "form-input"}}
          isValidDate={currentDate => moment(Date.now()).isAfter(currentDate)}
          onChange={
            (e) => tryCatch(
              // get the unix time from the date picker
              fieldInput.onChange(moment(e).toDate().getTime())
            )
          }
        />
    );
};