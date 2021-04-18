import React from 'react';
import ReactDom from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import Calendar from '../pages/search-component/desktop-components/Calendar';

// PASSED
it("renders without crashing", () => {
  const div = document.createElement('div');
  ReactDom.render(<BrowserRouter><Calendar/></BrowserRouter>, div);
});
