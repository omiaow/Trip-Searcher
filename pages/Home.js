import React from 'react';
import SearchTool from './searchTool/SearchTool';

function Home() {
  return (
    <div className="searchPanel" style={{height: window.innerHeight}}>
      <div className="header" style={{height: window.innerHeight/4}}></div>
      <h1>Your Next Trip</h1>
      <SearchTool/>
    </div>
  );
}

export default Home;
