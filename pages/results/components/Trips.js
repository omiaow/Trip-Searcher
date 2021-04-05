import React from 'react';
import Tickets from './Tickets';
import { Switch, Route } from 'react-router-dom';
import { createFilterState, sortPrices, monthNames, specialOffer } from '../../../utils/tools';
import searchEngine from '../../../utils/searchEngine';

class Result extends React.Component {

  componentDidMount(){
    if(this.props.data != undefined && this.props.data.length != 0 && this.props.myLocation != undefined)
      this.setState(createFilterState(this.props.data, this.props.myLocation));
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
                this.setState({filter: filter, selectedTicket: undefined, specialTickets: false});
            }}/>
            <span className="checkmark"></span>
          </label>

          <div className="nights">
            <span>nights</span><br/>

            <input type="number" value={ filter[i].nights }

            onChange={(e) => {
              if(e.target.value !== '' && e.target.value > 0){
                filter[i].nights = parseInt(e.target.value);
                this.setState({filter: filter, lastChosen: e.target.value, selectedTicket: undefined, specialTickets: false});
              }else if(e.target.value === ''){
                filter[i].nights = e.target.value;
                this.setState({filter: filter, selectedTicket: undefined, specialTickets: false});
              }
            }}

            onFocus={() => {
              let lastChosen = filter[i].nights;
              filter[i].nights = '';
              this.setState({filter: filter, lastChosen: lastChosen, selectedTicket: undefined, specialTickets: false});
            }}

            onBlur={() => {
              filter[i].nights = parseInt(this.state.lastChosen);
              this.setState({filter: filter, selectedTicket: undefined, specialTickets: false});
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

  renderTrips(){

    let trips = searchEngine(this.state.myLocation, this.props.data, this.state.filter);
    trips = sortPrices(trips);

    let specials = ((trips.length > 0) ?
      specialOffer(this.state.myLocation, this.props.data, this.state.filter, trips[0].price) :
      specialOffer(this.state.myLocation, this.props.data, this.state.filter, undefined));
    specials = sortPrices(specials);

    let tripList = [];
    let specialList = [];

    trips.forEach( (item, i) => this.createTripList(item, i, tripList));

    specials.forEach( (item, i) => this.createTripList(item, i, specialList));

    return (
      <div className="trips" style={{width: ((window.innerWidth > 999) ? ('71%') : ('100%'))}}>
        {
          (specials.length <= 0) ? "" :
          <div className="special_offer" style={{backgroundColor: (!this.state.specialTickets) ? "#7EC9A1" : "#FFFFFF"}}>
            <div className="name"
                 style={{color: (this.state.specialTickets ? "#7EC9A1" : "#FFFFFF")}}
                 onClick={() => this.setState({specialTickets: ((this.state.specialTickets === undefined) ? (true) : (!this.state.specialTickets)), selectedTicket: undefined})}
            >Special offer from {specials[0].price}$</div>
            {(this.state.specialTickets) ? specialList : ""}
          </div>
        }
        {
          (this.state.specialTickets) ? "" :
            <div className="list">
              {((tripList.length === 0) ? <h2 className="message">No, flights for selected options</h2> : tripList)}
            </div>
        }
      </div>
    );

  }

  createTripList(item, i, list){

    function tripName(tickets){
      let name = "";

      for(let i=0; i<tickets.length-1; i++)
        name += `${tickets[i].destination.city}, `;

      return name.slice(0, name.length-2);
    }

    let fromDate = new Date(item.tickets[0].date);
    let toDate = new Date(item.tickets[item.tickets.length-1].date);

    list.push(
        <div className="trip" key={i}
             style={(i == this.state.selectedTicket) ? ({boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.29), 0 3px 10px 0 rgba(0, 0, 0, 0.29)'}) : (null)}
             onClick={() => {
               if(i != this.state.selectedTicket){
                 this.setState({selectedTicket: i});
               }else{
                 this.setState({selectedTicket: undefined});
               }
             }}>
          <span>Trip to {tripName(item.tickets)}</span>
          <p>{fromDate.getDate()} {monthNames[fromDate.getMonth()]}, {fromDate.getFullYear()} - {toDate.getDate()} {monthNames[toDate.getMonth()]}, {toDate.getFullYear()}</p>
          <span className="price">Total price: {item.price}$</span>
        </div>
    );

    if(i == this.state.selectedTicket){
      list.push(
        <div className="ticket_details" key={'T'}>
          <Tickets tickets={item.tickets} initialLocation={this.state.myLocation} width={(window.innerWidth*(71/100))*(96/100)}/>
        </div>
      );
    }
  }

  render(){

    if(this.state != null){
      return(
        <>
          { this.filterPanel(this.state.filter) }
          { this.renderTrips() }
        </>
      );
    }else return <></>;

  }

}

export default Result;
