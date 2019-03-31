import React, { Component } from 'react';
import axios from 'axios';
import './index.css';
import Search from '../Search';
import Table from '../Table';
import Button from '../Button';
import {Loading, withLoading, updateSearchTopStoriesState} from '../../utils';
import {
	DEFAULT_QUERY,
	DEFAULT_HPP,
	PATH_BASE,
	PATH_SEARCH,
	PARAM_SEARCH,
	PARAM_PAGE,
	PARAM_HPP,
} from '../../constants';


const ButtonWithLoading = withLoading(Button);

class App extends Component {
	_isMounted = false;

	constructor(props) {
		super(props);
		this.state = {
			results: null,
			searchKey: '',
			searchTerm: DEFAULT_QUERY,
			error: null,
			isLoading: false,
		};

		this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
		this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
		this.onDismiss = this.onDismiss.bind(this);
		this.onSearchChange = this.onSearchChange.bind(this);
		this.onSearchSubmit = this.onSearchSubmit.bind(this);
		this.setSearchTopStories = this.setSearchTopStories.bind(this);
	}

	fetchSearchTopStories(searchTerm, page = 0) {
		this.setState({isLoading: true})
		axios.get(
			`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}
			&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
		)
			.then(result => this._isMounted && this.setSearchTopStories(result.data))
			.catch(error => this._isMounted && this.setState({error: error}));
	}

	componentDidMount() {
		this._isMounted = true;
		const { searchTerm } = this.state;
		this.setState({searchKey: searchTerm});
		this.fetchSearchTopStories(searchTerm);
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	needsToSearchTopStories(searchTerm) {
		return !this.state.results[searchTerm];
	}

	onDismiss(id) {
		const {searchKey, results} = this.state;
		const {hits, page} = results[searchKey];
		const isNotId = item => item.objectID !== id;
		const updatedHits = hits.filter(isNotId);
		this.setState({
			results: {
				...results,
				[searchKey]: {hits: updatedHits, page}
			}
		});
	}

	onSearchChange(event) {
		this.setState(
			{searchTerm: event.target.value}
		);
		event.preventDefault();
	}

	onSearchSubmit(event) {
		const { searchTerm } = this.state;
		this.setState({searchKey: searchTerm});
		if (this.needsToSearchTopStories(searchTerm)) {
			this.fetchSearchTopStories(searchTerm);
		}
		event.preventDefault();
	}

	setSearchTopStories(result) {
		const {hits, page} = result;
		this.setState(updateSearchTopStoriesState(hits, page));
}

	render() {
		const {
			searchTerm,
			results,
			searchKey,
			error,
			isLoading,
		} = this.state;

		const page = (
			results &&
			results[searchKey] &&
			results[searchKey].page
		) || 0;

		const list = (
			results &&
			results[searchKey] &&
			results[searchKey].hits
		) || [];

		return(
			<div className='page'>
				<div className='interactions'>
					<Search
						onSearchChange={this.onSearchChange}
						onSubmit={this.onSearchSubmit}
						searchTerm={searchTerm} >
						Search
					</Search>
					{ error ?
						<p> Something went wrong... </p>
						:
						<Table
							list={list}
							onDismiss={this.onDismiss}
						/>
					}
					<ButtonWithLoading
						isLoading={isLoading}
						onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
						More
					</ButtonWithLoading>
				</div>
			</div>
			);
	}
}


export default App;
