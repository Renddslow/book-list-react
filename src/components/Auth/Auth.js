import React from 'react';
import { FieldTextStateless } from '@atlaskit/field-text';
import Button from '@atlaskit/button';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

import './Auth.css';

export default class Auth extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      phoneNumber: '',
      code: '',
      confirmationOpen: false,
    };
  }

  componentDidMount() {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
      'size': 'invisible',
      'callback': function(response) {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // onSignInSubmit();
      }
    });
  }

  confirmCode = () => {
    this.confirmation.confirm(this.state.code)
      .then((result) => {
        const user = result.user;
        firebase.database().ref(`/book-users/${user.uid}`)
          .once('value')
          .then((data) => data.val())
          .then((data) => {
            if (!data) {
              window.location.href = '/';
            }
            window.localStorage.setItem('books:currentUser', JSON.stringify(data));
            window.location.href = '/';
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  setField = (fieldName) => ({ target: { value } }) => {
    this.setState({ [fieldName]: value });
  };

  sendConfirmation = () => {
    firebase.auth().signInWithPhoneNumber(this.state.phoneNumber, this.recaptchaVerifier)
      .then((confirmationResult) => {
        this.confirmation = confirmationResult;
        this.setState({ confirmationOpen: true });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <div className="login-box">
        {
          this.state.confirmationOpen ?
            <React.Fragment>
              <FieldTextStateless
                value={this.state.code}
                onChange={this.setField('code')}
                label="Confirmation Code"
                maxLength={6}
              />
              <div id="sign-in-button" />
              <p>
                <Button appearance="primary" onClick={this.confirmCode}>Verify</Button>
              </p>
            </React.Fragment> :
            <React.Fragment>
              <FieldTextStateless
                shouldFitContainer
                value={this.state.phoneNumber}
                onChange={this.setField('phoneNumber')}
                label="Phone Number"
                placeholder="+10001234567"
              />
              <div id="sign-in-button" />
              <p>
                <Button appearance="primary" onClick={this.sendConfirmation}>Send Confirmation</Button>
              </p>
            </React.Fragment>
        }
      </div>
    );
  }
}
