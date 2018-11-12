import React from 'react';
import { FieldTextStateless } from '@atlaskit/field-text';
import Button from '@atlaskit/button';
import { FieldTextAreaStateless } from '@atlaskit/field-text-area';
import Group from '@atlaskit/tag-group';
import Tag from '@atlaskit/tag';
import { ToggleStateless } from '@atlaskit/toggle';
import shortId from 'shortid';
import firebase from 'firebase/app';
import 'firebase/database';

import './Form.css';

export default class Form extends React.Component {
  static defaultProps = {
    currentUser: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      author: '',
      description: '',
      amazonUrl: '',
      topics: '',
      reads: {
        matt: false,
        elijah: false,
      },
      ratings: {
        elijah: 0,
        matt: 0,
      },
      addedBy: this.props.currentUser.id,
    };
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleEscape);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleEscape);
  }

  handleEscape = (e) => {
    if (e.key === 'Escape') {
      this.props.onClose();
    }
  };

  createBook = async () => {
    firebase.database().ref(`/books/${shortId.generate()}`)
      .set(this.state, () => this.props.onClose());
  };

  setValue = (field) => (e) => {
    this.setState({ [field]: e.target.value });
  };

  setToggleValue = (id) => () => {
    this.setState((prevState) => ({
      reads: {
        ...prevState.reads,
        [id]: !prevState.reads[id],
      }
    }));
  };

  render() {
    return (
      <div className="form-sticky">
        <div className="form-container">
          <FieldTextStateless
            shouldFitContainer
            label="Book Title"
            onChange={this.setValue('title')}
            value={this.state.title}
          />
          <FieldTextStateless
            shouldFitContainer
            label="Author"
            onChange={this.setValue('author')}
            value={this.state.author}
          />
          <FieldTextAreaStateless
            shouldFitContainer
            label="Description (copy + paste from Amazon)"
            onChange={this.setValue('description')}
            value={this.state.description}
            minimumRows={5}
          />
          <FieldTextStateless
            shouldFitContainer
            label="Amazon URL"
            onChange={this.setValue('amazonUrl')}
            value={this.state.amazonUrl}
          />
          <FieldTextStateless
            shouldFitContainer
            label="Topics"
            onChange={this.setValue('topics')}
            value={this.state.topics}
          />
          <Group>
            {
              this.state.topics
                .split(',')
                .map((topic) => topic.trim())
                .filter((topic) => topic)
                .map((topic, idx) => (
                  <Tag
                    text={topic}
                    color="blue"
                    key={`topic-${idx}`}
                  />
                ))
            }
          </Group>
          <p>Mark as Read</p>
          <ToggleStateless
            isChecked={this.state.reads[this.props.currentUser.id]}
            onChange={this.setToggleValue(this.props.currentUser.id)}
            label="Mark as Read"
            size="large"
          />
          <p>
            <Button
              appearance="primary"
              onClick={this.createBook}
            >
              Create
            </Button>
            <Button
              appearance="subtle"
              onClick={this.props.onClose}
            >
              Cancel
            </Button>
          </p>
        </div>
      </div>
    )
  }
}
