import React from 'react';
import './App.css';
import Home from './pages/Home';
import Search from './pages/Search';
import Tickets from './pages/Tickets';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <div className="wrapper">
          <main>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/search" component={Search}/>
            <Route path="/tickets" component={Tickets}/>
          </Switch>
          </main>
          <footer><p>Footer</p></footer>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
