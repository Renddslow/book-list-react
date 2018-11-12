import React from 'react';
import Lozenge from '@atlaskit/lozenge';

import Avatar from '../Avatar';

import './Book.css';

export default ({ data, showDescription }) => (
  <div className="row">
    <div className="row-meta">
      <h2>{data.title}</h2>
      <p>{data.author}</p>
      <div className="topics">
        {
          data.topics
            .split(',')
            .map((topic) => topic.trim())
            .filter((topic) => topic)
            .map((topic, idx) => (
              <Lozenge key={`${data.id}-topic-${idx}`} >{topic}</Lozenge>
            ))
        }
      </div>
    </div>
    <div className="spacer" />
    <div className="row-details">
      {
        data.reads.matt && <Avatar reader="matt" />
      }
      {
        data.reads.elijah && <Avatar reader="elijah" />
      }
    </div>
    <div className="spacer" />
    <div className="row-footer">
      {
        <a href={data.amazonUrl}>
          Purchase
        </a>
      }
      <div
        className="more-button"
        role="button"
        onClick={showDescription(data)}
      >
        <i className="material-icons">
          info_outline
        </i>
      </div>
    </div>
  </div>
);
