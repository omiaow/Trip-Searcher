import React from 'react';
import ReactDom from 'react-dom';
import ToInput from '../pages/search-component/mobile-components/ToInput';

// PASSED
it("renders without crashing", () => {
  const div = document.createElement('div');
  ReactDom.render(<ToInput/>, div);
});
