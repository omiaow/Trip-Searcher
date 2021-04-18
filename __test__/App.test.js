import React from 'react';
import ReactDom from 'react-dom';
import App from '../App';

// PASSED
it("renders without crashing", () => {
  const div = document.createElement('div');
  ReactDom.render(<App/>, div);
  ReactDom.unmountComponentAtNode(div);
});
