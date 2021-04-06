import React from 'react';
import Flights from './components/Flights';
import Trips from './components/Trips';
import { Switch, Route } from 'react-router-dom';
import {withRouter} from 'react-router-dom';

class Result extends React.Component {
  state = { trip: false }

  componentDidMount(){
    this.setState({trip: false});
  }

  componentDidUpdate(){
    if(this.state.query !== this.props.location.search && this.props.location.search.length > 0){
      this.setState({trip: false, query: this.props.location.search});
    }
  }

  switchPage = (name) => {
    if(name === "tickets"){
      this.setState({trip: false});
    }else if(name === "trips" && !this.props.switchTrip){
      this.setState({trip: true});
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
        {(!this.state.trip) ?
            <Flights data={this.props.data} myLocation={this.props.myLocation} fromDate={this.props.fromDate}/> :
            <Trips data={this.props.data} myLocation={this.props.myLocation} fromDate={this.props.fromDate}/>}
      </div>
    );
  }

}

export default withRouter(Result);
