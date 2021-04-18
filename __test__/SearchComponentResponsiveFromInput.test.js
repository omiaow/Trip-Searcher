import React from 'react';
import ReactDom from 'react-dom';
import FromInput from '../pages/search-component/mobile-components/FromInput';

// PASSED
it("renders without crashing", () => {
  const div = document.createElement('div');
  ReactDom.render(<FromInput/>, div);
});
