import React from 'react';

import './Avatar.css';

export default ({ reader }) => (
  <div
    className={`avatar avatar--${reader}`}
    title={`${reader} has read this book`}
  >
    {
      reader === 'matt' ?
        'MM' :
        'EH'
    }
  </div>
)