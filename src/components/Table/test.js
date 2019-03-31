import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Table from './';
import {list, blank_func} from '../../Testing_values.js';


Enzyme.configure({adapter: new Adapter});

describe('Table', () => {
  it('renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Table
      list={list}
      onDismiss={blank_func}
      />,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  })

  it('has valid snappy', () => {
    const comp = renderer.create(
      <Table
      list={list}
      onDismiss={blank_func}
      />
    );
    let tree = comp.toJSON();
    expect(tree).toMatchSnapshot();
  })

  it('lenght of props', () => {
    const element = shallow(
      <Table
      list={list}
      onDismiss={blank_func}
      />
    );
    expect(element.find('.table-row').length).toBe(2);
  })
})
