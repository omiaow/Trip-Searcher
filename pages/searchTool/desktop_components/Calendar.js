import React from 'react';
import {monthNames, shortWeekNames, shortMonthNames} from '../../../utils/tools';

class Calendar extends React.Component {

  state = {
    departure_string: "From when?",
    return_string: "To when?",
    departureInput: "",
    returnInput: "",
    departure_value: undefined,
    return_value: undefined,

    show: false,
    calendar_name: "from when",
    left_month: {month: (new Date().getMonth()), year: (new Date().getFullYear())},
    right_month: {month: (new Date(new Date().getFullYear(), new Date().getMonth()+1).getMonth()), year: (new Date(new Date().getFullYear(), new Date().getMonth()+1).getFullYear())}
  };

  move_right = () => {
    this.setState({left_month: this.state.right_month, right_month: {month: new Date(this.state.right_month.year, this.state.right_month.month+1).getMonth(), year: new Date(this.state.right_month.year, this.state.right_month.month+1).getFullYear()}});
  }

  move_left = () => {
    this.setState({left_month: {month: new Date(this.state.left_month.year, this.state.left_month.month, 0).getMonth(), year: new Date(this.state.left_month.year, this.state.left_month.month, 0).getFullYear()}, right_month: this.state.left_month});
  }

  choose_date = (date) => {

    function to_string(given_date){
      var temp_month = given_date.month;
      var temp_day = given_date.day;
      if((temp_month+1) < 10){
        temp_month = "0" + (given_date.month+1);
      }else{
        temp_month = temp_month + 1;
      }
      if(temp_day < 10){
        temp_day = "0" + given_date.day;
      }
      return (given_date.year + "-" + temp_month + "-" + temp_day);
    }

    if(this.state.departure_value !== undefined && date !== undefined){
      if((new Date(date.year, date.month, date.day)).getTime() < (new Date(this.state.departure_value.year, this.state.departure_value.month, this.state.departure_value.day)).getTime()){
        this.setState({calendar_name: "to when", departureInput: to_string(date), departure_string: (shortWeekNames[(new Date(date.year, date.month, date.day)).getDay()] + ", " + date.day + "-" + shortMonthNames[date.month]), departure_value: date});
      }else{
        this.setState({return_value: date, returnInput: to_string(date), return_string: (shortWeekNames[(new Date(date.year, date.month, date.day)).getDay()] + ", " + date.day + "-" + shortMonthNames[date.month]), show: false});
      }
    }else if(date !== undefined){
      this.setState({calendar_name: "to when", departureInput: to_string(date), departure_string: (shortWeekNames[(new Date(date.year, date.month, date.day)).getDay()] + ", " + date.day + "-" + shortMonthNames[date.month]), departure_value: date});
    }else{
      this.setState({calendar_name: "from when", departure_value: date});
    }
  }

  select_dates = (day, month, year, departure_val) => {
  	if(departure_val != null){
  		var temp_from_date = new Date(departure_val.year, departure_val.month, departure_val.day+1);
  		var temp_till_date = new Date(year, month, day-1);
  		while (temp_from_date.getTime() <= temp_till_date.getTime()) {
  			try{
  				document.getElementById(temp_from_date.getDate()+"-"+temp_from_date.getMonth()+"-"+temp_from_date.getFullYear()).className = "inserting";
  				temp_from_date = new Date(temp_from_date.getFullYear(), temp_from_date.getMonth(), temp_from_date.getDate()+1);
  			}catch(e){
  				temp_from_date = new Date(temp_from_date.getFullYear(), temp_from_date.getMonth(), temp_from_date.getDate()+1);
  			};
  		}
  	}
  }

  unselect_dates = (day, month, year, departure_val) => {
  	if(departure_val != null){
  		var temp_from_date = new Date(departure_val.year, departure_val.month, departure_val.day+1);
  		var temp_till_date = new Date(year, month, day-1);
  		while (temp_from_date.getTime() <= temp_till_date.getTime()) {
  			try{
  				document.getElementById(temp_from_date.getDate()+"-"+temp_from_date.getMonth()+"-"+temp_from_date.getFullYear()).className = "days";
  				temp_from_date = new Date(temp_from_date.getFullYear(), temp_from_date.getMonth(), temp_from_date.getDate()+1);
  			}catch(e){
  				temp_from_date = new Date(temp_from_date.getFullYear(), temp_from_date.getMonth(), temp_from_date.getDate()+1);
  			};
  		}
  	}
  }

  get_month_data(date){
    return {week: new Date(date.getFullYear(), date.getMonth(), 1).getDay(), month_length: new Date(date.getFullYear(), date.getMonth()+1, 0).getDate()};
  }

  create_day(j, name, day, month, year){
    if(name === "empty"){
      return (<div className="empty" key={j} />);
    }else if(name === "past"){
      return (<div className="past" key={j} >{day}</div>);
    }else if(name === "today"){
      return (<div className="today" key={j} >{day}</div>);
    }else if(name === "days"){
      return (<div className="days"
                   key={j} onClick={this.choose_date.bind(null, {day: day, month: month, year: year})}
                   onMouseOver={this.select_dates.bind(null, day, month, year, this.state.departure_value)}
                   onMouseOut={this.unselect_dates.bind(null, day, month, year,this.state.departure_value)}
                   id={day+"-"+month+"-"+year}>{day}</div>);
    }else if(name === "selected"){
      return (<div className="selected" key={j} onClick={this.choose_date.bind(null, undefined)} >{day}</div>);
    }else if(name === "inserting"){
      return (<div className="inserting" key={j} >{day}</div>);
    }else{
      return null;
    }
  }

  create_month_days(month){
    var todays_day = new Date();
    var div_days = [];

    var first_day = this.get_month_data(new Date(month.year, month.month)).week-1;
    var month_length = this.get_month_data(new Date(month.year, month.month)).month_length;

    var j=0;
    for(var i=0; i<month_length; i++){
      const temp_date = new Date(month.year, month.month, (i+1));
      if(first_day%7 !== 0){
          div_days.push(this.create_day(j, "empty", (i+1)));
          first_day--;
          i--;
          j++;
      }else if((temp_date.getDate() < todays_day.getDate() &&
               temp_date.getMonth() === todays_day.getMonth() &&
               temp_date.getFullYear() === todays_day.getFullYear()) ||
               (temp_date.getMonth() < todays_day.getMonth() &&
               temp_date.getFullYear() <= todays_day.getFullYear()) ||
               (temp_date.getFullYear() < todays_day.getFullYear())){

          div_days.push(this.create_day(j, "past", (i+1)));
          j++;
      }else if(temp_date.getDate() === todays_day.getDate() &&
               temp_date.getMonth() === todays_day.getMonth() &&
               temp_date.getFullYear() === todays_day.getFullYear()){

          div_days.push(this.create_day(j, "today", (i+1)));
          j++;
      }else if(this.state.departure_value !== undefined && (this.state.departure_value.day === (i+1) && this.state.departure_value.month === temp_date.getMonth() && this.state.departure_value.year === temp_date.getFullYear())){
          div_days.push(this.create_day(j, "selected", (i+1), temp_date.getMonth(), temp_date.getFullYear()));
          j++;
      }else{
          div_days.push(this.create_day(j, "days", (i+1), temp_date.getMonth(), temp_date.getFullYear()));
          j++;
      }
    }

    return div_days;
  }

  show(){
    var return_val = (<div/>);
    if(this.state.show){
      var header = (
        <div className="calendarHeader">
          <div className="calendar_name">your vacation date</div>
          <div className="left" onClick={() => {this.move_left()}} />
          <div className="monthDescription">
            <p className="leftSide">{monthNames[this.state.left_month.month]+" "+this.state.left_month.year}</p>
            <p className="rightSide">{monthNames[this.state.right_month.month]+" "+this.state.right_month.year}</p>
          </div>
          <div className="right" onClick={() => {this.move_right()}} />
        </div>
      );

      var week_names = (
        <div  className="weekNames"><b>
          <div className="weekdays">Mo</div>
          <div className="weekdays">Tu</div>
          <div className="weekdays">We</div>
          <div className="weekdays">Th</div>
          <div className="weekdays">Fr</div>
          <div className="weekends">Sa</div>
          <div className="weekends">Su</div>
        </b></div>
      );

      var body = (
        <div className="twoMonth">
          <div className="leftMonth">
            {week_names}
            <div className="left_month_days">
              {this.create_month_days(this.state.left_month)}
            </div>
          </div>
          <div className="rightMonth">
            {week_names}
            <div className="right_month_days">
              {this.create_month_days(this.state.right_month)}
            </div>
          </div>
        </div>
      );

      return_val = (<div className="calendarWindow">{header}{body}</div>);
    }

    return return_val;
  }

  render() {
    return (
      <div className="dates">
        <h4>choose dates</h4>
          <div id="inputDate"
               onClick={(e) => {this.setState({show: !this.state.show, departure_value: undefined, return_value: undefined, departure_string: "From when?", return_string: "To when?", departureInput: "", returnInput: ""});}}
               onBlur={() => this.setState({focus: false})}
          >
          {this.state.departure_string} - {this.state.return_string}
          </div>
          {this.show()}
          <input type="hidden" id="fromDate" name="fromDate" value={this.state.departureInput}/>
          <input type="hidden" id="toDate" name="toDate" value={this.state.returnInput}/>
      </div>
    );
  }
}

export default Calendar;
