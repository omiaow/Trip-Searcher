import React from 'react';
import CityList from '../../../utils/airports.json';

class AutocompleteTo extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      value: "",
      autocompleteLength: 7,
      placeholder: "",
      tags: [],
      cityLimit: 5,
      url: ""
    };
  }

  componentDidMount(){
    this.changeData();
  }

  componentDidUpdate(){
    this.changeData();
  }

  changeData(){
    if(this.state.url != window.location.search){
      const queryString = require('query-string');
      const parsed = queryString.parse(window.location.search);
      let idList = parsed.Destinations.split(' ');
      let ids = idList.slice(0, idList.length-1);
      let tags = [];
      let placeholder = "";
      for(let id=0; id<ids.length; id++){
        let i=0;
        while(i<CityList.length && CityList[i].id != ids[id]) i++;
        let city = "";
        if(i<CityList.length){
          city = CityList[i].loc;
        }
        let loc = city.split(',')[0];
        tags.push({loc: loc, id: CityList[i].id});
        placeholder += `${loc}, `;
      }
      this.setState({url: window.location.search, placeholder: placeholder.slice(0, placeholder.length-2), value: "", tags: tags});
    }
  }

  choose = (loc, id) => {
    let check = false;
    this.state.tags.forEach( i => {
      if(i.id == id) check = true;
    });

    if(check || this.state.tags.length >= this.state.cityLimit){
      this.setState({value: ""});
    }else{
      this.state.tags.push({loc: loc, id: id});
      let placeholder = "";
      this.state.tags.forEach( tag => {
        placeholder += `${tag.loc}, `;
      });
      this.setState({tags: this.state.tags, value: "", placeholder: placeholder.slice(0, placeholder.length-2)});
    }

    this.fromInput.focus();
  }

  closeTag = (id) => {
    let i=0;
    while(i < this.state.tags.length && this.state.tags[i].id !== id){
      i++;
    }
    this.state.tags.splice(i, 1);
    let placeholder = "";
    this.state.tags.forEach( tag => {
      placeholder += `${tag.loc}, `;
    });
    this.setState({tags: this.state.tags, placeholder: placeholder.slice(0, placeholder.length-2)});
    this.fromInput.focus();
  }

  tags(){
    let tag_list = [];

    for(var i=0; i<this.state.tags.length; i++){
      tag_list.push(
        <div className="tag" key={i}>
          <span>{this.state.tags[i].loc}</span>
          <div className="close" onClick={this.closeTag.bind(null, this.state.tags[i].id)} >+</div>
        </div>
      );
    }

    var returnValue = (<div className="collectTag">{tag_list}</div>);
    return returnValue;
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
          list.push(<div className="autocompleteTag" key={j} onClick={this.choose.bind(null, city.split(',')[0], CityList[i].id)}> {city} </div>);
          j++;
        }else if(j >= this.state.autocompleteLength){
          i=CityList.length;
        }
      }
    }

    let returnValue = (<div className="autocomplete"> {list} </div>);
    return returnValue;

  }

  showInputs(){
    let value = "";
    this.state.tags.forEach( i => value += `${i.id}+`);
    return (<input type="hidden" id="Destinations" name="Destinations" value={value}/>);
  }

  render(){

    return(
      <>
        <div className="to" onClick={() => this.props.changeInput("toInput")}>
          <div className="icon"></div>
          <span>{(this.state.placeholder.length > 0) ? (this.state.placeholder) : ("To where? (city, country)")}</span>
          {this.showInputs()}
        </div>
        {(this.props.displayInput) ? (
          <div className="input">
            <div className="exit" onClick={ () => {this.setState({value: ""}); this.props.changeInput()} } >+</div>
            <div className="inputName">Destinations</div>
            {this.tags()}
            <input className="toInput"
                   autoComplete="nope"
                   type="text"
                   ref={(input) => { this.fromInput = input; }}
                   placeholder="city, country"
                   onChange={(e) => this.setState({value: e.target.value})}
                   value={this.state.value}
                   autoFocus/>
            <button  onClick={() =>  {this.setState({value: ""}); this.props.changeInput("calendarInput")} }/>
            {this.autocomplete()}
          </div>) : ("")}
      </>
    );
  }

}

export default AutocompleteTo;
