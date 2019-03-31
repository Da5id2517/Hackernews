import React from 'react';
import {sortBy} from 'lodash';

export const DEFAULT_QUERY = 'redux';
export const DEFAULT_HPP = 100;

export const PATH_BASE = 'https://hn.algolia.com/api/v1';
export const PATH_SEARCH = '/search';
export const PARAM_SEARCH = 'query=';
export const PARAM_PAGE = 'page=';
export const PARAM_HPP = 'hitsPerPage=';

export const largeColumn = {width: '40%'};
export const mediumColumn = {width: '30%'};
export const smallColumn = {width: '10%'};

export const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments'),
  POINTS: list => sortBy(list, 'points')
};
