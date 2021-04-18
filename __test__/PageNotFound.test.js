import React from 'react';
import ReactDom from 'react-dom';
import NotFound from '../pages/NotFound';

// PASSED
it("renders without crashing", () => {
  const div = document.createElement('div');
  ReactDom.render(<NotFound/>, div);
});
