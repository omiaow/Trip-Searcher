import React from 'react';
import RenderTickets from './RenderTickets';
import { Switch, Route } from 'react-router-dom';
import createState from '../utils/createState';
import searchEngine from '../utils/searchEngine';

class Result extends React.Component {

  componentDidMount(){
    if(this.props.data != undefined && this.props.data.length != 0 && this.props.myLocation != undefined)
      this.setState(createState(this.props.data, this.props.myLocation));
  }

  filterPanel(filter){

    let cities = [];

    for(let i=0; i<filter.length; i++){

      cities.push(
        <div className="city_tool" key={i}>
          <label className="container">
            <span className="word">{ filter[i].name }</span>
            <input type="checkbox" checked={filter[i].selected}
            onChange={() => {
                filter[i].selected = !filter[i].selected;
                this.setState({filter: filter});
            }}/>
            <span className="checkmark"></span>
          </label>

          <div className="nights">
            <span>nights</span><br/>

            <input type="number" value={ filter[i].nights }

            onChange={(e) => {
              if(e.target.value !== '' && e.target.value > 0){
                filter[i].nights = parseInt(e.target.value);
                this.setState({filter: filter, lastChosen: e.target.value});
              }else if(e.target.value === ''){
                filter[i].nights = e.target.value;
                this.setState({filter: filter});
              }
            }}

            onFocus={() => {
              let lastChosen = filter[i].nights;
              filter[i].nights = '';
              this.setState({filter: filter, lastChosen: lastChosen});
            }}

            onBlur={() => {
              filter[i].nights = parseInt(this.state.lastChosen);
              this.setState({filter: filter});
            }}

            />

          </div>
        </div>
      );
    }

    return (
      <div className="right_pannel" style={{width: ((window.innerWidth > 999) ? ('25%') : ('96%'))}}>
        <h3>Create your trip</h3>
        {cities}
      </div>
    );

  }

  renderTrips(trips){
    let month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    function names(tickets){
      let name = "";

      for(let i=0; i<tickets.length-1; i++)
        name += `${tickets[i].destination.city}, `;

      return name.slice(0, name.length-2);
    }

    let tripList = [];

    trips.forEach( (item, i) => {
      let fromDate = new Date(item.tickets[0].date);
      let toDate = new Date(item.tickets[item.tickets.length-1].date);

      tripList.push(
          <div className="trip" key={i}
               style={(i == this.state.selectedTicket) ? ({boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.29), 0 3px 10px 0 rgba(0, 0, 0, 0.29)'}) : (null)}
               onClick={() => {
                 if(i != this.state.selectedTicket){
                   this.setState({selectedTicket: i});
                 }else{
                   this.setState({selectedTicket: undefined});
                 }
               }}>
            <span>Trip to {names(item.tickets)}</span>
            <p>{fromDate.getDate()} {month[fromDate.getMonth()]}, {fromDate.getFullYear()} - {toDate.getDate()} {month[toDate.getMonth()]}, {toDate.getFullYear()}</p>
            <span className="price">Total price: {item.price}$</span>
          </div>
      );

      if(i == this.state.selectedTicket){
        tripList.push(
          <div className="ticket_details" key={'T'}>
            <RenderTickets tickets={item.tickets} initialLocation={this.state.myLocation} width={(window.innerWidth*(71/100))*(96/100)}/>
          </div>
        );
      }

    });

    return (
      <div className="trips" style={{width: ((window.innerWidth > 999) ? ('71%') : ('100%'))}}>
        {tripList}
      </div>
    );

  }

  render(){

    if(this.state != null){
      return(
        <>
          { this.filterPanel(this.state.filter) }
          { this.renderTrips(searchEngine(this.state.myLocation, this.props.data, this.state.filter)) }
        </>
      );
    }else return <></>;

  }

}

export default Result;
