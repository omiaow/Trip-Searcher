import React from 'react';
import ReactDom from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import Flights from '../pages/result-component/components/Flights';

// FAILED
it("renders without crashing", () => {
  const div = document.createElement('div');
  ReactDom.render(<BrowserRouter><Flights/></BrowserRouter>, div);
});
