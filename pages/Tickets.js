import React from 'react';
import SearchTool from './searchTool/SearchTool';
import RenderTickets from './results/components/Tickets';
import {withRouter} from 'react-router-dom';
import ticketsCall from '../utils/ticketsCall';

class Tickets extends React.Component {

  state = {
    total: 0,
    tickets: [],
    url: `${window.location.origin}/search`
  }

  update = (data) => {
    this.state.tickets.push(data);
    let total = this.state.total + data.price;
    this.setState({tickets: this.state.tickets, total: total});
  }

  componentDidMount(){
    let query = this.props.location.search;
    const queryString = require('query-string');
    const parsed = queryString.parse(query);
    ticketsCall(parsed, this.update);
    this.setState({url: `${this.state.url}?Origin=${parsed.Origin}&Destinations=${parsed.Destinations}&fromDate=${parsed.fromDate}&toDate=${parsed.toDate}`});
  }

  render(){
    return (
      <>
        <div className="searchPanel" style={{minHeight: window.innerHeight/3}}>
          <div className="header" style={{height: '25px'}}></div>
          <h1>Search Flights</h1>
          <SearchTool/>
        </div>
        <div className="result" id="result">
          <div className="header">
            <a href={this.state.url} style={({backgroundColor: "#ffffff", color: "#34495E"})}>search other options</a>
          </div>
          <div className="shared">
            <RenderTickets tickets={this.state.tickets} total={this.state.total} width={window.innerWidth*(96/100)} />
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(Tickets);
