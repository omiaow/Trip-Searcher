import React from 'react';
import ReactDom from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import SearchComponent from '../pages/search-component/SearchComponent';

// PASSED
it("renders without crashing", () => {
  const div = document.createElement('div');
  ReactDom.render(<BrowserRouter><SearchComponent/></BrowserRouter>, div);
});
