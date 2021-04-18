import React from 'react';
import ReactDom from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import ResultComponent from '../pages/result-component/Result';

// FAILED
it("renders without crashing", () => {
  const div = document.createElement('div');
  ReactDom.render(<BrowserRouter><ResultComponent/></BrowserRouter>, div);
});
