import React, {Component} from 'react';
import Sort from '../Sort';
import Button from '../Button';
import PropTypes from 'prop-types';
import {
  smallColumn,
  mediumColumn,
  largeColumn,
  SORTS
} from '../../constants';


export default class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortKey: 'NONE',
      isSortReversed: false,
    }

    this.onSort = this.onSort.bind(this);
  };

  onSort(sortKey) {
    const isSortReversed = sortKey === this.state.sortKey && !this.state.isSortReversed
    this.setState({isSortReversed: isSortReversed, sortKey: sortKey})
  }

  render() {
  const {list, onDismiss} = this.props;
  const {sortKey, isSortReversed} = this.state;
  const sortedList = SORTS[sortKey](list);
  const reverseSortedList = isSortReversed ?
    sortedList.reverse() :
    sortedList;
  return (
    <div className='table'>
      <div className='table-header'>
        <span style={{width: largeColumn}}>
          <Sort
            sortKey={'TITLE'}
            onSort={this.onSort}
            activeSortKey={sortKey}>
            Title
          </Sort>
        </span>
        <span style={{width: mediumColumn}}>
          <Sort
            sortKey={'AUTHOR'}
            onSort={this.onSort}
            activeSortKey={sortKey}>
            Author
          </Sort>
        </span>
        <span style={{width:smallColumn}}>
          <Sort
            sortKey={'COMMENTS'}
            onSort={this.onSort}
            activeSortKey={sortKey}>
            Comments
          </Sort>
        </span>
        <span style={{width:smallColumn}}>
          <Sort
            sortKey={'POINTS'}
            onSort={this.onSort}
            activeSortKey={sortKey}>
            Points
          </Sort>
        </span>
        <span style={{width:smallColumn}}>
          Archive
        </span>
      </div>
      {reverseSortedList.map(item =>
        <div key='obejctID' className='table-row'>
          <span style={largeColumn}>
            <a href={item.url}> {item.title} </a>
            </span>
            <span style={mediumColumn}> {item.author} </span>
            <span style={smallColumn}> {item.num_comment} </span>
            <span style={smallColumn}> {item.points} </span>
            <span style={smallColumn}>
            <Button
            onClick={() => onDismiss(item.objectID)}
            className='button-inline'>
              Dismiss
            </Button>
            </span>
          </div>
        )
      }
      </div>
    );
  }
}

Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isrequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comment: PropTypes.number,
      points: PropTypes.number,
    }).isRequired
  ),
  onDismiss: PropTypes.func.isRequired,
};
