import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Button from './';
import {blank_func, test_string} from '../../Testing_values.js';


describe('Button', () => {
  it('renders properly.', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Button onClick={blank_func}>
      {test_string}
      </Button>,
       div
     );
    ReactDOM.unmountComponentAtNode(div);
  });

  it('has valid snap.', () => {
    const comp = renderer.create(
      <Button onClick={blank_func}>
      {test_string}
      </Button>
    );
    let tree = comp.toJSON();
    expect(tree).toMatchSnapshot();
  })
})
