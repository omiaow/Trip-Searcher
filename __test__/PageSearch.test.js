import React from 'react';
import ReactDom from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import Search from '../pages/Search';

// PASSED
it("renders without crashing", () => {
  const div = document.createElement('div');
  ReactDom.render(<BrowserRouter><Search/></BrowserRouter>, div);
});
