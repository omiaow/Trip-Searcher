import React from 'react';
import {withRouter} from 'react-router-dom';

class Calendar extends React.Component {

  state = {
    valueFrom: "",
    valueTo: "",
    placeholderFrom: "From where?",
    placeholderTo: "To where?",
    departure: undefined,
    arrival: undefined
  }

  chooseDate = (date) => {
    let month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    let placeholder = `${date.getDate()} ${month[date.getMonth()]}, ${date.getFullYear()}`;
    let newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    let value = newDate.toISOString().slice(0, 10);
    if(this.state.departure === undefined){
      this.setState({departure: date, placeholderFrom: placeholder, valueFrom: value});
    }else if(this.state.arrival === undefined && date > this.state.departure){
      this.setState({arrival: date, placeholderTo: placeholder, valueTo: value});
    }else if(date.getDate() === this.state.departure.getDate() && date.getMonth() === this.state.departure.getMonth() && date.getFullYear() === this.state.departure.getFullYear()){
      this.setState({departure: undefined, arrival: undefined, placeholderFrom: "From where?", placeholderTo: "To where?", valueFrom: "", valueTo: ""});
    }else if(this.state.arrival !== undefined && date.getDate() === this.state.arrival.getDate() && date.getMonth() === this.state.arrival.getMonth() && date.getFullYear() === this.state.arrival.getFullYear()){
      this.setState({arrival: undefined, placeholderTo: "To where?", valueTo: ""});
    }else if(date > this.state.departure){
      this.setState({arrival: date, placeholderTo: placeholder, valueTo: value});
    }else{
      this.setState({departure: date, placeholderFrom: placeholder, valueFrom: value});
    }
  }

  createDay(j, name, date){
    if(name === "empty"){
      return (<div className="empty" key={j} />);
    }else if(name === "passed"){
      return (<div className="passed" key={j} >{date.getDate()}</div>);
    }else if(name === "today"){
      return (<div className="today" key={j} >{date.getDate()}</div>);
    }else if(name === "days"){
      return (<div className="days" key={j} onClick={this.chooseDate.bind(null, date)}>{date.getDate()}</div>);
    }else if(name === "choosedFrom"){
      return (<div className="choosedFrom" key={j} onClick={this.chooseDate.bind(null, date)}>{date.getDate()}</div>);
    }else if(name === "choosedTill"){
      return (<div className="choosedTill" key={j} onClick={this.chooseDate.bind(null, date)}>{date.getDate()}</div>);
    }else if(name === "selected"){
      return (<div className="selected" key={j} onClick={this.chooseDate.bind(null, date)}>{date.getDate()}</div>);
    }else{
      return null;
    }
  }

  createMonth(givenDate, i){
    let monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let table = [];
    let today = givenDate, y = today.getFullYear(), m = today.getMonth();
    let firstDay = new Date(y, m, 1);
    let lastDay = new Date(y, m + 1, 0);
    let week = 1;

    while(firstDay <= lastDay || week % 7 !== 1){
      if(firstDay <= lastDay && week > getWeekDay(firstDay)){
        if(firstDay.getDate() === (new Date()).getDate() && firstDay.getMonth() === (new Date()).getMonth() && firstDay.getFullYear() === (new Date()).getFullYear()){
          table.push(this.createDay(week, "today", new Date(firstDay)));
        }else if(firstDay < new Date()){
          table.push(this.createDay(week, "passed", new Date(firstDay)));
        }else if(this.state.departure !== undefined && firstDay.getDate() === this.state.departure.getDate() && firstDay.getMonth() === this.state.departure.getMonth() && firstDay.getFullYear() === this.state.departure.getFullYear()){
          table.push(this.createDay(week, "choosedFrom", new Date(firstDay)));
        }else if(this.state.arrival !== undefined && firstDay.getDate() === this.state.arrival.getDate() && firstDay.getMonth() === this.state.arrival.getMonth() && firstDay.getFullYear() === this.state.arrival.getFullYear()){
          table.push(this.createDay(week, "choosedTill", new Date(firstDay)));
        }else if(this.state.departure !== undefined && this.state.arrival !== undefined && firstDay > this.state.departure && firstDay < this.state.arrival){
          table.push(this.createDay(week, "selected", new Date(firstDay)));
        }else{
          table.push(this.createDay(week, "days", new Date(firstDay)));
        }
        firstDay.setDate(firstDay.getDate() + 1);
      }else{
        table.push(this.createDay(week, "empty", firstDay));
      }
      week++;
    }

    function getWeekDay(date){
      let day = date.getDay();
      if (day === 0) day = 7;
      return day - 1;
    }

    return (<div key={i}><div className="monthName">{monthList[lastDay.getMonth()]}</div><div className="dates">{table}</div></div>);
  }

  show(){
    let date = new Date();
    let calendar = [];
    for(let i=0; i<5; i++){
      calendar.push(this.createMonth(date, i));
      date.setMonth(date.getMonth() + 1);
    }
    return (<div className="monthBox">{calendar}</div>);
  }

  render(){
    return(
      <>
        <div className="date" onClick={() => this.props.changeInput("calendarInput")}>
          <h2>dates</h2>
          <p>{`${this.state.placeholderFrom} - ${this.state.placeholderTo}`}</p>
          <input type="hidden" id="fromDate" name="fromDate" value={this.state.valueFrom}/>
          <input type="hidden" id="toDate" name="toDate" value={this.state.valueTo}/>
        </div>
        {(this.props.displayInput) ? (
          <div className="input">
            <div className="exit" onClick={ () => this.props.changeInput() } >+</div>
            <div className="inputName">Vacation dates</div>
            <div className="weekNames">
              <div className="weekdays">Mo</div>
              <div className="weekdays">Tu</div>
              <div className="weekdays">We</div>
              <div className="weekdays">Th</div>
              <div className="weekdays">Fr</div>
              <div className="weekends">Sa</div>
              <div className="weekends">Su</div>
            </div>
            {this.show()}
            <input type="submit" value="search" onClick={() => {
              this.props.changeInput();
              this.props.search(this.props.history);
            }}/>
          </div>) : ("")}
      </>
    );
  }

}

export default withRouter(Calendar);
