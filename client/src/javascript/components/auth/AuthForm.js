import {formatMessage, FormattedMessage, injectIntl} from 'react-intl';
import classnames from 'classnames';
import React from 'react';

import AuthStore from '../../stores/AuthStore';
import EventTypes from '../../constants/EventTypes';
import FloodActions from '../../actions/FloodActions';

const METHODS_TO_BIND = ['handleAuthError', 'handleFormSubmit'];

class AuthForm extends React.Component {
  constructor() {
    super();

    this.state = {error: null};

    METHODS_TO_BIND.forEach((method) => {
      this[method] = this[method].bind(this);
    });
  }

  componentDidMount() {
    AuthStore.listen(EventTypes.AUTH_LOGIN_ERROR, this.handleAuthError);
    AuthStore.listen(EventTypes.AUTH_REGISTER_ERROR, this.handleAuthError);
  }

  componentWillUnmount() {
    AuthStore.unlisten(EventTypes.AUTH_LOGIN_ERROR, this.handleAuthError);
    AuthStore.unlisten(EventTypes.AUTH_REGISTER_ERROR, this.handleAuthError);
  }

  getValue(fieldName) {
    return this.state[fieldName];
  }

  handleAuthError(error) {
    this.setState({error});
  }

  handleFormSubmit(event) {
    event.preventDefault();

    if (this.props.mode === 'login') {
      AuthStore.authenticate({
        username: this.refs.username.value,
        password: this.refs.password.value
      });
    } else {
      AuthStore.register({
        username: this.refs.username.value,
        password: this.refs.password.value
      });
    }
  }

  render() {
    let actionText = null;
    let error = null;
    let headerText = null;

    if (this.props.mode === 'login') {
      actionText = this.props.intl.formatMessage({
        id: 'auth.log.in',
        defaultMessage: 'Log In'
      });
      headerText = this.props.intl.formatMessage({
        id: 'auth.login',
        defaultMessage: 'Login'
      });
    } else {
      actionText = this.props.intl.formatMessage({
        id: 'auth.create.account',
        defaultMessage: 'Create Account'
      });
      headerText = this.props.intl.formatMessage({
        id: 'auth.create.an.account',
        defaultMessage: 'Create an Account'
      });
    }

    if (!!this.state.error) {
      error = (
        <div className="form__row form__row--error">
          <div className="form__column">
            {this.state.error}
          </div>
        </div>
      );
    }

    return (
      <form className="form form--authentication"
        onSubmit={this.handleFormSubmit}>
        <div className="form__wrapper">
          <div className="form__row form__header">
            <h1>{headerText}</h1>
          </div>
          <div className="form__row">
            <div className="form__column">
              <input className="textbox textbox--open"
                placeholder={this.props.intl.formatMessage({
                  id: 'auth.username',
                  defaultMessage: 'Username'
                })} ref="username" type="text" />
            </div>
          </div>
          <div className="form__row">
            <div className="form__column">
              <input className="textbox textbox--open"
                placeholder={this.props.intl.formatMessage({
                  id: 'auth.password',
                  defaultMessage: 'Password'
                })} ref="password" type="password" />
            </div>
          </div>
          {error}
        </div>
        <div className="form__actions">
          <button className="button button--inverse button--primary"
            type="submit">
            {actionText}
          </button>
        </div>
      </form>
    );
  }
}

export default injectIntl(AuthForm);
