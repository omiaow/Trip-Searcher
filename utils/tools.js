import airports from './airports.json';
import searchEngine from './searchEngine';

export function createFilterState(data, location){
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

export function sortPrices(list){
  if (list.length < 2) return list;

  const pivot = list[Math.floor(Math.random() * list.length)];

  let left = [];
  let equal = [];
  let right = [];

  for (let element of list) {
    if (element.price > pivot.price) right.push(element);
    else if (element.price < pivot.price) left.push(element);
    else equal.push(element);
  }

  return sortPrices(left)
    .concat(equal)
    .concat(sortPrices(right));
}

export const weekNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const shortWeekNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

export function specialOffer(location, data, filter, minPrice){

  let specials = [];

  for(let i=0; i<filter.length; i++){
    const newFilter = JSON.parse(JSON.stringify(filter));
    newFilter[i].nights += 1;
    const trips = searchEngine(location, data, newFilter);
    trips.forEach( trip => {
      if(minPrice !== undefined && trip.price < minPrice) specials.push(trip);
      else if(minPrice === undefined) specials.push(trip);
    });
  }

  return specials;
}
