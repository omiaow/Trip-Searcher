import React from 'react';
import ReactDom from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import Trips from '../pages/result-component/components/Trips';

// PASSED
it("renders without crashing", () => {
  const div = document.createElement('div');
  ReactDom.render(<BrowserRouter><Trips/></BrowserRouter>, div);
});
