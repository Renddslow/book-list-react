import React from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import firebase from 'firebase/app';
import 'firebase/database';

import './Description.css';

const openLink = (link) => () => {
  window.open(link, '_blank');
};

const markAsRead = (id, userId, value) => {
  console.log(`/books/${id}/reads/${userId}`);
  firebase.database().ref(`/books/${id}/reads/${userId}`)
    .set(value);
};

export default ({ hideDescription, data, currentUser }) => (
  <div className="description-container">
    <div className="description-content">
      <div className="description-header">
        <div className="spacer" />
        <div
          className="close-button"
          role="button"
          onClick={hideDescription}
        >
          <i className="material-icons">
            close
          </i>
        </div>
      </div>
      <div className="description-body">
        <h2>{data.title}</h2>
        <p>{data.description}</p>
        <ButtonGroup>
          <Button
            onClick={openLink(data.amazonUrl)}
            appearance="subtle"
          >
            Purchase
          </Button>
          {
            currentUser && !data.reads[currentUser.id] &&
            <Button
              appearance="primary"
              onClick={async () => {
                await markAsRead(data.id, currentUser.id, true);
                hideDescription();
              }}
            >
              Mark as Read
            </Button>
          }
        </ButtonGroup>
      </div>
    </div>
  </div>
);
