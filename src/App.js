import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

import Book from './components/Book';
import Description from './components/Description';
import Form from './components/Form';
import Auth from './components/Auth';

import './App.css';

firebase.initializeApp({
  apiKey: "AIzaSyD0FqHcXMBC_BUX1Q3DjZZzwX9_SPQsfQk",
  authDomain: "com-porcupine-vineyard.firebaseapp.com",
  databaseURL: "https://com-porcupine-vineyard.firebaseio.com",
  projectId: "com-porcupine-vineyard",
  storageBucket: "com-porcupine-vineyard.appspot.com",
  messagingSenderId: "1029985267812"
});
firebase.auth().useDeviceLanguage();

class App extends Component {
  currentUser = null;

  constructor(props) {
    super(props);

    const userDataRaw = window.localStorage.getItem('books:currentUser');

    if (userDataRaw) {
      this.currentUser = JSON.parse(userDataRaw);
    }

    this.state = {
      data: [],
      activeDatum: null,
      showDescription: false,
      formOpen: false,
    };
  }

  componentDidMount() {
    firebase.database()
      .ref('/books')
      .on('value', (data) => {
        const books = data.val();
        this.setState({
          data: Object.keys(books).map((key) => ({ ...books[key], id: key })),
        });
      });


  }

  showDescription = (activeDatum) => () => {
    this.setState({
      activeDatum,
      showDescription: true,
    });
  };

  hideDescription = () => {
    this.setState({
      activeDatum: {},
      showDescription: false,
    });
  };

  toggleForm = () => {
    this.setState((prevState) => ({ formOpen: !prevState.formOpen }));
  };

  render() {
    return (
      <div className="App">
        <header>
          <div className="header-content">
            <h1>Matt &amp; Elijah's Big Book List</h1>
            <div className="spacer" />
            {
              !this.currentUser &&
              <a href="/login">Login</a>
            }
          </div>
        </header>
        {
          window.location.pathname === '/login' ?
            <Auth /> :
            <React.Fragment>
              {
                this.state.showDescription && this.state.activeDatum ?
                  <Description
                    hideDescription={this.hideDescription}
                    data={this.state.activeDatum}
                    currentUser={this.currentUser}
                  /> :
                  <React.Fragment>
                    <div className="container">
                      {
                        this.state.data.map((datum) => (
                          <Book
                            data={datum}
                            showDescription={this.showDescription}
                            key={datum.id}
                          />
                        ))
                      }
                    </div>
                    {
                      this.currentUser &&
                      <div
                        className="fab"
                        onClick={this.toggleForm}
                        role="button"
                      >
                        <i className="material-icons">
                          add
                        </i>
                      </div>
                    }
                  </React.Fragment>
              }
              {
                this.currentUser && this.state.formOpen &&
                <Form
                  currentUser={this.currentUser}
                  onClose={this.toggleForm}
                />
              }
            </React.Fragment>
        }
      </div>
    );
  }
}

export default App;
