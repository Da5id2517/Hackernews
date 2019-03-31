import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Sort from './';
import {test_string, blank_func} from '../../Testing_values.js';


describe('Search', () => {
  it('renders properly', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Sort
      onSort={blank_func}
      activeSortKey={test_string}
      sortKey={test_string}>
        {test_string}
      </Sort>
      , div
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  it('has valid snap', () => {
    const comp = renderer.create(
      <Sort
      onSort={blank_func}
      activeSortKey={test_string}
      sortKey={test_string}>
        {test_string}
      </Sort>
    );
    let tree = comp.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
