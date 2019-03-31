import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import {sortBy} from 'lodash';
import './App.css';


const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const url = `${PATH_BASE}${PATH_SEARCH}${PARAM_SEARCH}${DEFAULT_QUERY}`

let object_mold = PropTypes.shape({
	objectID: PropTypes.string,
	author: PropTypes.string,
	url: PropTypes.string,
	num_comments: PropTypes.number,
	points: PropTypes.number,
})

const SORTS = {
	NONE: list => list,
	TITLE: list => sortBy(list, 'title'),
	AUTHOR: list => sortBy(list, 'author'),
	COMMENTS: list => sortBy(list, 'comments').reverse(),
	POINTS: list => sortBy(list, 'points').reverse(),
};

const Loading = () => <div>Loading...</div>;

const withLoading = (Component) => ({isLoading, ...rest}) =>
	isLoading ?
	<Loading /> :
	<Component {...rest} />;

const Button = ({onClick, children}) =>
	<button
	type="button"
	onClick={onClick}
	>
	{children}
	</button>

	Button.propTypes = {
	onClick: PropTypes.func,
	children: PropTypes.node,
	};

const ButtonWithLoading = withLoading(Button);

class Search extends React.Component {
	componentDidMount() {
		if(this.input) {
			this.input.focus();
		}
	}

	render() {
		const {
			value,
			onChange,
			onSubmit,
			children,
		} = this.props;
		return (
			<form onSubmit={onSubmit}>
			<input
			type="text"
			value={value}
			onChange={onChange}
			ref={(node) => {this.input = node;}}
			/>
		<button type="submit">
		{children}
		</button>
		</form>
		);

		Search.propTypes = {
			onChange: PropTypes.func,
			onSubmit: PropTypes.func,
			children: PropTypes.node,
			value: PropTypes.string,
		};
	}
}

const Table = ({ list, onDismiss, sortkey, onSort }) => 
  <div className="table">
    {SORTS[sortkey](list).map(item =>
      <div key={item.objectID} className="table-row">
        <span style={{ width: '40%' }}>
          <a href={item.url}>{item.title}</a>
        </span>
        <span style={{ width: '30%' }}>
          {item.author}
        </span>
        <span style={{ width: '10%' }}>
          {item.num_comments}
        </span>
        <span style={{ width: '10%' }}>
          {item.points}
        </span>
        <span style={{ width: '10%' }}>
          <Button
            onClick={() => onDismiss(item.objectID)}
            className="button-inline"
          >
            Dismiss
          </Button>
        </span>
      </div>
    )}
  </div>

  Table.propTypes = {
  	list: PropTypes.arrayOf(object_mold),
  	onDismiss: PropTypes.func,
  };


class App extends Component
{
	_isMounted = false;

	constructor(props)
	{
		super(props);
		this.state = {
			results: null,
			searchKey: '',
			searchTerm: DEFAULT_QUERY,
			error: null,
			isLoading: false,
			sortkey: 'NONE',
		};
		this.onDismiss = this.onDismiss.bind(this);
		this.onSearchChange = this.onSearchChange.bind(this);
		this.setSearchTopStories = this.setSearchTopStories.bind(this);
		this.onSearchSubmit = this.onSearchSubmit.bind(this);
		this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
		this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
		this.onSort = this.onSort.bind(this);
	}

	componentDidMount()
	{
		this._isMounted = true;
		const {searchTerm} = this.state;
		this.setState({searchKey: searchTerm});
		this.fetchSearchTopStories(searchTerm);
	}

	render()
	{
		const {searchTerm, results, searchKey, error, isLoading, sortkey} = this.state;
		const page = (results && results[searchKey] && results[searchKey].page) || 0;
		const list = (results && results[searchKey] && results[searchKey].hits) || [];

		return(
			<div className="page">
				<div className="interactions">

					<Search
						value={this.state.searchTerm}
						onChange={this.onSearchChange}
						onSubmit={this.onSearchSubmit}>
						Search
					</Search>

				</div>
					{ error ?
						<div className="interactions">
						<p> Something went wrong </p>;
						</div>
						:
						<Table
						sortkey={sortkey}
						onSort={this.onSort}
						list={list}
						onDismiss={this.onDismiss} />
					}
				<div className="interactions">
					<ButtonWithLoading isLoading={this.state.isLoading} onClick={() => this.fetchSearchTopStories(searchKey, page+1)}>
					More
					</ButtonWithLoading>
				</div>
			</div>
			);
		// console.log(this.state);
		// Use this for seeing what the fuck is going on with state.
	}

	componentWillUnmount()
	{
		this._isMounted = false;
	}

	onDismiss(id)
	{
		const {searchKey, results} = this.state;
		const {hits, page} = results[searchKey];
		const isNotId = item => item.objectID !== id;
		const updateHits = hits.filter(isNotId);
		this.setState(
				{result: {...results, [searchKey]: {hits: updateHits}}}
			);
	}

	onSearchChange(e)
	{
		// console.log(e);
		this.setState({searchTerm:e.target.value});
	}

	onSort(sortkey) {
		this.setStat({sortkey:sortkey});
	}

	setSearchTopStories(result)
	{
		const {hits, page} = result;
		const {searchKey, results} = this.state;
		const oldHits = results && results[searchKey] ?
			results[searchKey].hits:
			[];
		const updatedHits = [...oldHits, ...result];
		this.setState(
			{
				results:
				{
					...results, [searchKey]: {hits: updatedHits, page}
				},
				isLoading: false,
			}
			);
	}

	onSearchSubmit(event)
	{
		const {searchTerm} = this.state;
		this.setState({searchKey: searchTerm});
		if(this.needsToSearchTopStories(searchTerm))
		{
			this.fetchSearchTopStories(searchTerm);
		}
		this.fetchSearchTopStories(searchTerm);
		event.preventDefault();
	}

	fetchSearchTopStories(searchTerm, page=0)
	{
		this.setState({isLoading: true,});
		axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
			.then(result => this._isMounted && this.setSearchTopStories(result.data))
			.catch(error => this._isMounted && this.setState({error}));
	}

	needsToSearchTopStories(searchTerm)
	{
		return !this.state.results[searchTerm];
	}

}

export default App;

export
{
	Button,
	Table,
	Search
};