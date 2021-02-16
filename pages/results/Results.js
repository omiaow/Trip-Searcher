import React from 'react';

class Result extends React.Component {
  state = {
    daysWidth: 210,
    ticketWidth: 250,
    data: undefined,
    date: undefined,
    location: undefined,
    initialDate: undefined,
    initialLocation: undefined,
    tickets: [],
    total: 0
  }

  componentDidUpdate(){
    if(this.state.data === undefined || this.props.data.length !== this.state.data.length) this.setState({data: this.props.data, location: this.props.myLocation, date: this.props.fromDate, initialLocation: this.props.myLocation, initialDate: this.props.fromDate});
  }

  moveRight(e){
    if(e) document.querySelector('#ticketList').scrollLeft += 400;
    else document.querySelector('#ticketScreen').scrollLeft += 400;
  }

  moveLeft(e){
    if(e) document.querySelector('#ticketList').scrollLeft -= 400;
    else document.querySelector('#ticketScreen').scrollLeft -= 400;
  }

  chooseTicket = (ticket) => {
      this.state.tickets.push(ticket);
      let total = 0;
      this.state.tickets.forEach( i => total+=i.price);
      this.setState({tickets: this.state.tickets, location: ticket.destination.id, total: total});
  }

  removeTicket = (i) => {
    let newList = [];
    let total = 0;
    for(let j=0; j<i; j++){
      newList.push(this.state.tickets[j]);
      total += this.state.tickets[j].price;
    }
    this.setState({tickets: newList, location: ((newList.length>0)?(newList[newList.length-1].destination.id):(this.state.initialLocation)), total: total});
  }

  generateFlights(data, origin){
    let month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let weeks = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let result = [];

    if(data !== undefined && origin !== undefined){
      for(let i=0; i<data.length; i++){
        let date = new Date(data[i].day);
        if(((origin !== this.state.initialLocation) || (origin === this.state.initialLocation && i!=data.length-1)) && ((this.state.tickets.length === 0) || (this.state.tickets.length > 0 && date.getTime() > new Date(this.state.tickets[this.state.tickets.length-1].date).getTime()))) {
          let tickets = [];
          let j=0;
          while(j<data[i].flights.length && data[i].flights[j].origin != origin) j++;
          if(j<data[i].flights.length){
            data[i].flights[j].tickets.forEach((item, k) => {
              const ticket = ((item.direct) ?
              (<div className="direct_ticket" onClick={this.chooseTicket.bind(null, item)} key={k}><div className="city">{item.price}$ {item.destination.city}</div></div>) :
              (<div className="nondirect_ticket" onClick={this.chooseTicket.bind(null, item)} key={k}><div className="city">{item.price}$ {item.destination.city}</div></div>));
              tickets.push(ticket);
            });
          }

          if(tickets.length === 0) tickets.push(<div className="empty" key="0">No flights</div>);

          result.push(
            <div className="daily_list" key={i}>
              <div className="header">
                <div className="day">{date.getDate()}</div>
                <div className="month_weeks">
                  <div className="month">{month[date.getMonth()]}</div>
                  {(date.getDay() === 6 || date.getDay() === 0) ? (<div className="weekend">{weeks[date.getDay()]}</div>) : (<div className="weekday">{weeks[date.getDay()]}</div>)}
                </div>
              </div>
              {tickets}
            </div>
          );
        }
      }
    }

    return (
      <>
        <div className="header">
          <h2 className="location">{(this.state.tickets.length > 0)?(this.state.tickets[this.state.tickets.length-1].destination.city):("Your destination")} to</h2>
          {(this.state.total > 0)?(<h2 className="total">Total: {this.state.total}$</h2>):("")}
        </div>
        {(window.innerWidth >= 1000 && (window.innerWidth*90/100) < (this.props.data.length*this.state.daysWidth)) ? (<div className="left_button" onClick={() => this.moveLeft(true)}/>) : ("")}
        <div className="ticket_list" id="ticketList" style={((window.innerWidth < 1000 || (window.innerWidth*90/100) >= (this.props.data.length*this.state.daysWidth)) ? ({width: '90%', marginLeft: '5%', marginRight: '5%'}) : ({width: '90%'}))}>
          {result}
        </div>
        {(window.innerWidth >= 1000 && (window.innerWidth*90/100) < (this.props.data.length*this.state.daysWidth)) ? (<div className="right_button" onClick={() => this.moveRight(true)}/>) : ("")}
        <div className="color_description"><div className="direct"/><span>direct</span>
        <div className="transit"/><span>transit</span></div>
      </>
    );
  }

  generateTickets(){
    let month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let tickets = [];
    this.state.tickets.forEach((item, i) => {
      const date = new Date(item.date);
      tickets.push(
        <div className="ticket" key={i}>
          <div className="close" onClick={this.removeTicket.bind(null, i)}>+</div>
          <div className="border">
            <div className="description">from:</div>
            <div className="data_words">{item.origin.city} ({item.origin.iata})</div>
            <div className="description">to:</div>
            <div className="data_words">{item.destination.city} ({item.destination.iata})</div>
            <div className="description">date:</div>
            <div className="data_words">{date.getDate()} {month[date.getMonth()]}, {date.getFullYear()}</div>
            <div className="description">direct:</div>
            <div className="data_words">{(item.direct)?("Yes"):("No")}</div>
            <div className="description">price:</div>
            <div className="price">{item.price}$</div>
            <div className="company">{item.airline}</div>
          </div>
        </div>
      );
    });
    return (
      <div className="tickets">
        <h3>{(this.state.tickets.length > 0 && this.state.tickets[this.state.tickets.length-1].destination.id != this.state.initialLocation)?("Your ticket details"):(`Total: ${this.state.total}$`)}</h3>
        {(window.innerWidth >= 1000 && (window.innerWidth*90/100) < (this.state.tickets.length*this.state.ticketWidth)) ? (<div className="left_button" onClick={() => this.moveLeft(false)}/>) : ("")}
        <div className="ticket_screen" id="ticketScreen"  style={((window.innerWidth < 1000 || (window.innerWidth*90/100) >= (this.state.tickets.length*this.state.ticketWidth)) ? ({width: '90%', marginLeft: '5%', marginRight: '5%'}) : ({width: '90%'}))}>
          {tickets}
        </div>
        {(window.innerWidth >= 1000 && (window.innerWidth*90/100) < (this.state.tickets.length*this.state.ticketWidth)) ? (<div className="right_button" onClick={() => this.moveRight(false)}/>) : ("")}
      </div>
    );
  }

  render(){
    return(
      <div className="result">
        {((this.state.tickets.length > 0 && this.state.tickets[this.state.tickets.length-1].destination.id != this.state.initialLocation) || (this.state.tickets.length === 0))?(this.generateFlights(this.state.data, this.state.location)):("")}
        {(this.state.tickets.length > 0)?(this.generateTickets()):("")}
      </div>
    );
  }

}

export default Result;
