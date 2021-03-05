import React from 'react';
import DesktopFromInput from './desktop_components/FromInput';
import DesktopToInput from './desktop_components/ToInput';
import DesktopCalendar from './desktop_components/Calendar';
import MobileFromInput from './mobile_components/FromInput';
import MobileToInput from './mobile_components/ToInput';
import Calendar from './mobile_components/Calendar';
import {withRouter} from 'react-router-dom';

class SearchTool extends React.Component {

  state = {
    displayFromInput: false,
    displayToInput: false,
    displayCalendarInput: false
  }

  changeInput = (name) => {
    if(name == "fromInput") this.setState({displayFromInput: true, displayToInput: false, displayCalendarInput: false});
    else if(name == "toInput") this.setState({displayFromInput: false, displayToInput: true, displayCalendarInput: false});
    else if(name == "calendarInput") this.setState({displayFromInput: false, displayToInput: false, displayCalendarInput: true});
    else this.setState({displayFromInput: false, displayToInput: false, displayCalendarInput: false});
  }

  search(history){
    let origin = document.querySelector('#Origin').value;
    let destinations = document.querySelector('#Destinations').value;
    let fromDate = document.querySelector('#fromDate').value;
    let toDate = document.querySelector('#toDate').value;
    let errorMessage = "";

    function checkLocations(or, dest){
      let o = or.split('+')[0];
      let d = dest.split('+');
      for(let i=0; i<d.length-1; i++){
        if(d[i] == o) return true;
      }
      return false;
    }

    if(origin.length > 0 && checkLocations(origin, destinations)) errorMessage = "Selected from and to the same city.";
    else if(origin.length === 0 || destinations.length === 0 || fromDate.length === 0 || toDate.length === 0) errorMessage = "Please, fill the form to search.";

    if(errorMessage.length > 0){
      document.querySelector('#errorMessage').style.backgroundColor = '#FF8B8B';
      document.querySelector('#errorMessage').innerHTML = errorMessage;
      setTimeout(() => {
        try{
          document.querySelector('#errorMessage').style.backgroundColor = '#30475e';
          document.querySelector('#errorMessage').innerHTML = "";
        }catch(e){}
      }, 5000);
    }else{
      history.push({
        pathname: '/search/tickets',
        search: `?Origin=${origin}&Destinations=${destinations}&fromDate=${fromDate}&toDate=${toDate}`
      });
    }
  }

  render(){
    return (
      <>
        <div id="errorMessage"></div>
        {(window.innerWidth < 1000) ? (
          <div className="responsive_search">
            <MobileFromInput displayInput={this.state.displayFromInput} changeInput={this.changeInput} />
            <MobileToInput displayInput={this.state.displayToInput} changeInput={this.changeInput} />
            <Calendar displayInput={this.state.displayCalendarInput} changeInput={this.changeInput} search={this.search} />
            <input type="submit" value="search" onClick={() => this.search(this.props.history)}/>
          </div>
        ) : (
          <div className="desktop_search">
            <DesktopFromInput/>
            <DesktopToInput/>
            <DesktopCalendar/>
            <input type="submit" value="search" onClick={() => this.search(this.props.history)}/>
          </div>
        )}
      </>
    );
  }

}

export default withRouter(SearchTool);
