import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Search from './';
import {blank_func, test_string} from '../../Testing_values.js';


describe('Search', () => {
  it('renders okay', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Search
      onSearchChange={blank_func}
      onSubmit={blank_func}
      value={test_string}
      searchTerm={test_string}>
      {test_string}
      </Search>
      , div
    );
    ReactDOM.unmountComponentAtNode(div);
  })

  it('has valid snap.', () => {
    const component = renderer.create(
      <Search
      onSearchChange={blank_func}
      onSubmit={blank_func}
      value={test_string}
      searchTerm={test_string}>
      {test_string}
      </Search>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })
})
