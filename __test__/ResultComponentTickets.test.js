import React from 'react';
import ReactDom from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import Tickets from '../pages/result-component/components/Tickets';

// PASSED
it("renders without crashing", () => {
  const div = document.createElement('div');
  ReactDom.render(<BrowserRouter><Tickets /></BrowserRouter>, div);
});
