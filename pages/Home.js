import React from 'react';
import SearchComponent from './search-component/SearchComponent';

function Home() {
  return (
    <div className="searchPanel" style={{height: window.innerHeight}}>
      <div className="header" style={{height: window.innerHeight/4}}></div>
      <h1>Your Next Trip</h1>
      <SearchComponent/>
    </div>
  );
}

export default Home;
