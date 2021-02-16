import React from 'react';
import CityList from '../../utils/airports.json';

class AutocompleteFrom extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      value: "",
      autocompleteLength: 7,
      placeholder: "",
      id: ""
    };
  }

  choose = (city, id) => {
    this.setState({placeholder: city, value: "", id: id});
    this.props.changeInput("toInput");
  }

  autocomplete(){

    function check_substring(given_str, checking_str){
      var splitted = given_str.split(" ");
      var return_check_substring = true;
      for(var i=0; i<splitted.length; i++){
        if(!(checking_str.toUpperCase().includes(splitted[i].toUpperCase()))){
          return_check_substring = false;
        }
      }
      return return_check_substring;
    }

    let list = [];
    if(this.state.value.length > 0){
      var j=0;
      for(var i=0; i<CityList.length; i++){
        if(check_substring(this.state.value, CityList[i].loc) && j < this.state.autocompleteLength){
          let city = CityList[i].loc;
          if(city.includes("&#039;")){
            city = (`${city.slice(0, city.indexOf("&#039;"))}'${city.slice((city.indexOf("&#039;")+6), city.length)}`);
          }
            list.push(<div className="autocompleteTag" key={j} onClick={this.choose.bind(null, city, CityList[i].id)}> {city} </div>);
          j++;
        }else if(j >= this.state.autocompleteLength){
          i=CityList.length;
        }
      }
    }

    let returnValue = (<div className="autocomplete"> {list} </div>);
    return returnValue;

  }

  render(){

    return(
      <>
        <div className="from" onClick={() => this.props.changeInput("fromInput")}>
          <h2>from</h2>
          <p>{(this.state.placeholder.length > 0) ? (this.state.placeholder) : ("From where? (city, countries)")}</p>
          <input type="hidden" id="Origin" name="Origin" value={this.state.id}/>
        </div>
        {(this.props.displayInput) ? (
          <div className="input">
            <div className="exit" onClick={ () => {this.setState({value: ""}); this.props.changeInput()} } >+</div>
            <div className="inputName">Origin</div>
            <input className="fromInput"
                   autoComplete="nope"
                   type="text"
                   placeholder={(this.state.placeholder.length > 0) ? (this.state.placeholder) : ("city, countries")}
                   onChange={(e) => this.setState({value: e.target.value})}
                   value={this.state.value}
                   autoFocus/>
            {this.autocomplete()}
          </div>) : ("")
        }
      </>
    );
  }

}

export default AutocompleteFrom;
