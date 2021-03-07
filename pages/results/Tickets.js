import React from 'react';
import RenderTickets from './RenderTickets';

class Tickets extends React.Component {

  state = {
    daysWidth: 220,
    data: undefined,
    date: undefined,
    location: undefined,
    initialDate: undefined,
    initialLocation: undefined,
    tickets: [],
    total: 0
  }

  componentDidMount(){
    this.update();
  }

  componentDidUpdate(){
    this.update();
  }

  update(){
    if(this.state.data === undefined || this.props.data.length !== this.state.data.length)
      this.setState({
        data: this.props.data,
        location: this.props.myLocation,
        date: this.props.fromDate,
        initialLocation: this.props.myLocation,
        initialDate: this.props.fromDate
      });
  }

  moveRight(){
    document.querySelector('#ticketList').scrollLeft += 400;
  }

  moveLeft(){
    document.querySelector('#ticketList').scrollLeft -= 400;
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

        if( ((origin !== this.state.initialLocation) || (origin === this.state.initialLocation && i != data.length-1))
            && ((this.state.tickets.length === 0) || (this.state.tickets.length > 0 && date.getTime() > new Date(this.state.tickets[this.state.tickets.length-1].date).getTime())) ) {

          let tickets = [];
          let j=0;
          while(j<data[i].flights.length && data[i].flights[j].origin != origin) j++;

          if(j<data[i].flights.length){

            data[i].flights[j].tickets.forEach( (item, k) => {

              let exist = true;

              this.state.tickets.forEach( check => {
                if(check.destination.id == item.destination.id){
                  exist = false;
                }
              });

              if(exist){
                const ticket = (
                  (item.direct) ?
                    ( <div className="direct_ticket" onClick={ this.chooseTicket.bind(null, item) } key={k}><div className="city">{ item.price }$ { item.destination.city } ({ item.destination.iata })</div></div> ) :
                    ( <div className="nondirect_ticket" onClick={ this.chooseTicket.bind(null, item) } key={k}><div className="city">{ item.price }$ { item.destination.city } ({ item.destination.iata })</div></div> )
                );
                tickets.push(ticket);
              }

            });

          }

          if(tickets.length === 0)
            tickets.push( <div className="empty" key="0">No flights</div> );

          result.push(
            <div className="daily_list" key={i}>
              <div className="header">
                <div className="day">{ date.getDate() }</div>
                <div className="month_weeks">
                  <div className="month">{ month[ date.getMonth() ] }</div>
                  {(date.getDay() === 6 || date.getDay() === 0) ?
                     (<div className="weekend">{ weeks[ date.getDay() ] }</div>) :
                     (<div className="weekday">{ weeks[ date.getDay() ] }</div>)}
                </div>
              </div>
              { tickets }
            </div>
          );

        }

      }

    }

    return (
      <>

        <div className="header">
          <h2 className="location">{(this.state.tickets.length > 0)?(this.state.tickets[this.state.tickets.length-1].destination.city):("Your destination")} to</h2>
          {(this.state.total > 0) ?
              (<h2 className="total">Total: {this.state.total}$</h2>) :
              ("")}
        </div>

        {(window.innerWidth >= 1000 && (window.innerWidth*90/100) < ((result.length)*this.state.daysWidth)) ?
           (<div className="left_button" onClick={() => this.moveLeft()}/>) :
           ("")}

        <div className="ticket_list" id="ticketList"
             style={((window.innerWidth < 1000 || (window.innerWidth*90/100) >= ((result.length) * this.state.daysWidth)) ?
               ({width: '90%', marginLeft: '5%', marginRight: '5%'}) :
               ({width: '90%'}))}>

          {result}

        </div>

        {(window.innerWidth >= 1000 && (window.innerWidth*90/100) < ((result.length)*this.state.daysWidth)) ?
           (<div className="right_button" onClick={() => this.moveRight()}/>) :
           ("")}

        <div className="color_description">
          <div className="direct"/><span>direct</span>
          <div className="transit"/><span>transit</span>
        </div>

      </>
    );

  }

  render(){
    return(
      <>
      <div className="ticket_borders">
        {(this.state.tickets.length > 0) ?
           ( <RenderTickets width={window.innerWidth*(96/100)} tickets={this.state.tickets} initialLocation={this.state.initialLocation} total={this.state.total} removeTicket={this.removeTicket} /> ) :
           ("")}
      </div>

        {((this.state.tickets.length > 0 && this.state.tickets[this.state.tickets.length-1].destination.id != this.state.initialLocation) || (this.state.tickets.length === 0)) ?
          ( this.generateFlights(this.state.data, this.state.location) ) :
          ("")}

      </>
    );
  }

}

export default Tickets;
