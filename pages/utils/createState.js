import airports from './airports.json'
export default function createState(data, location){
  let state = {
    fromDate: data[0].day,
    toDate: data[data.length-1].day,
    filter: [],
    myLocation: location
  }

  const interval = data.length-1;

  data[0].flights.forEach( (flight, j) => {
    if(flight.origin != location){
      let city = {selected: false, nights: 1, name: undefined, id: flight.origin};
      if(state.filter.length < interval) city.selected = true;
      let i=0;
      while(i<airports.length && airports[i].id != flight.origin) i++;
      if(i<airports.length) city.name = airports[i].loc;
      state.filter.push(city);
    }
  });

  return state;
}
