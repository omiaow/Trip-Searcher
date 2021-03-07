import React from 'react';
import Tickets from './Tickets';
import Trips from './Trips';
import { Switch, Route } from 'react-router-dom';
import {withRouter} from 'react-router-dom';

class Result extends React.Component {
  state = { trip: false }

  componentDidMount(){
    this.setState({trip: false});
  }

  componentDidUpdate(){
    if(this.state.query !== this.props.location.search && this.props.location.search.length > 0){
      this.props.history.push({
          pathname: '/search/tickets',
          search: this.props.location.search
      });
      this.setState({trip: false, query: this.props.location.search});
    }
  }

  switchPage = (name) => {
    if(name === "tickets"){
      this.setState({trip: false});
      this.props.history.push({pathname: `/search/${name}`, search: this.props.location.search});
    }else if(name === "trips" && !this.props.switchTrip){
      this.setState({trip: true});
      this.props.history.push({pathname: `/search/${name}`, search: this.props.location.search});
    }
  }

  render(){
    return(
      <div className="result" id="result">
        <div className="header">
          <button style={(!this.state.trip)?
                           ({backgroundColor: "#34495E", color: "#ffffff"}):
                           ({backgroundColor: "#ffffff", color: "#34495E"})}
                  onClick={() => this.switchPage("tickets")}>tickets</button>
          <button style={(this.props.switchTrip)?
                           ({backgroundColor: "#ffffff", border: "1px solid #E5E7E9", color: "#E5E7E9"}):
                           ((this.state.trip)?
                              ({backgroundColor: "#34495E", color: "#ffffff"}):
                              ({backgroundColor: "#ffffff", color: "#34495E"}))}
                  onClick={() => this.switchPage("trips")}>trips</button>
        </div>
        <Switch>
          <Route exact path="/search/tickets">
            <Tickets data={this.props.data} myLocation={this.props.myLocation} fromDate={this.props.fromDate}/>
          </Route>
          <Route exact path="/search/trips">
            <Trips data={this.props.data} myLocation={this.props.myLocation} fromDate={this.props.fromDate}/>
          </Route>
        </Switch>
      </div>
    );
  }

}

export default withRouter(Result);
