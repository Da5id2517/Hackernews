import React, {Component} from 'react';
import PropTypes from 'prop-types';


export default class Search extends Component {

  componentDidMount() {
    if (this.input) {
      this.input.focus();
    }
  }

  render() {
    const {
      onSearchChange,
      onSubmit,
      searchTerm,
      children,
    } = this.props;

    return(
      <form onSubmit={onSubmit}>
        <input
        type='text'
        onChange={onSearchChange}
        value={searchTerm}
        ref={(node) => {this.input = node;}}
        />
        <button type='submit'>
        {children}
        </button>
      </form>
    );
  }
};

Search.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  searchTerm: PropTypes.string.isRequired,
};
