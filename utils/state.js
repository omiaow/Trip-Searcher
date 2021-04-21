import airports from './airports.json';
import { headers } from './api-key.js';

export const weekNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const shortWeekNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

// creates state for filter panel in trip page
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

// sorts the lists by price
export function sortPrices(list){
  if (list !== undefined && list.length < 2) return list;
  else if(list === undefined || list !== undefined && list.length === 0) return list;

  const pivotID = Math.floor(Math.random() * list.length);
  const pivot = list[pivotID];

  if(pivot === undefined){
    list.splice(pivotID, 1);
    return sortPrices(list);
  }

  let left = [];
  let equal = [];
  let right = [];

  for (let element of list) {
    const exists = (element !== undefined);
    if (exists && element.price > pivot.price) right.push(element);
    else if (exists && element.price < pivot.price) left.push(element);
    else if (exists) equal.push(element);
  }

  return sortPrices(left)
    .concat(equal)
    .concat(sortPrices(right));
}

// generates the special filter state extending by one day of the original trip plan
export function specialOffer(location, data, filter, minPrice){
  let specials = [];

  for(let i=0; i<filter.length; i++){
    if(filter[i].selected){
      const newFilter = JSON.parse(JSON.stringify(filter));
      newFilter[i].nights += 1;
      const trips = searchEngine(location, data, newFilter);
      trips.forEach( trip => {
        if(minPrice !== undefined && trip.price < minPrice) specials.push(trip);
        else if(minPrice === undefined) specials.push(trip);
      });
    }
  }

  return specials;
}

// rebuilds the SkyScanner API result making a ticket list
export function generateTicket(flight, locId){
  let flightList = [];

  flight.Quotes.forEach(item => {
    let ticket = { price: item.MinPrice, direct: item.Direct};
    ticket.airline = getAirline(flight.Carriers, item.OutboundLeg.CarrierIds);
    ticket.origin = getLocation(flight.Places, item.OutboundLeg.OriginId);
    ticket.destination = getLocation(flight.Places, item.OutboundLeg.DestinationId, locId);
    let flightDate = item.OutboundLeg.DepartureDate.split('T')[0];
    ticket.date = flightDate;
    ticket.url = `https://www.skyscanner.hu/transport/flights/${ticket.origin.iata}/${ticket.destination.iata}/${flightDate.substring(2, 4) + flightDate.substring(5, 7) + flightDate.substring(8, 10)}/`;
    flightList.push(ticket);
  });

  function getAirline(airlines, ids){
    let result = [];
    ids.forEach( i => {
      airlines.forEach( j => {
        if(j.CarrierId == i){
          result.push(j.Name);
        }
      });
    });
    return result;
  }

  function getLocation(places, id, locId){
    for(let i=0; i<places.length; i++){
      if(places[i].PlaceId == id){
        return {airportName: places[i].Name, iata: places[i].IataCode, country: places[i].CountryName, city: places[i].CityName, id: locId};
      }
    }
    return undefined;
  }

  return flightList;
}

/* ----- SEARCH ENGINE ----- */
// search engine's helper function finds the cheapest ticket
function findCheapestTicketWithDestination(origin, date, destination, data, directOnly){
  let ticket = undefined;

  let i=0;
  while(i<data.length && new Date(data[i].day).getTime() != date.getTime()) i++;

  if(i<data.length){
    let j=0;
    while(j<data[i].flights.length && data[i].flights[j].origin != origin) j++;

    if(j<data[i].flights.length){
      data[i].flights[j].tickets.forEach( (item) => {
        if(item.destination.id == destination && ticket != undefined && item.price < ticket.price) ticket = item;
        else if(item.destination.id == destination && ticket == undefined) ticket = item;
      });
    }
  }

  return ticket;
}

// search engine's helper recursive function to find the chapest cycle
function getCheapestTripOnSelectedDate(origin, finalOrigin, date, cities, data, directOnly){
  if(cities.length > 1){
    let trip = undefined;

    for(let i=0; i<cities.length; i++){
      let first = findCheapestTicketWithDestination(`${origin}`, date, cities[i].id, data, directOnly);

      if(first !== undefined){

        let restCities = cities.filter( (item) => item.id !== cities[i].id );

        let newDate = new Date(date);
        newDate.setDate(newDate.getDate() + cities[i].nights);

        let rest = getCheapestTripOnSelectedDate(`${cities[i].id}`, finalOrigin, newDate, restCities, data, directOnly);

        if(rest !== undefined && trip !== undefined && trip.price > (first.price + rest.price)){
          trip = {price: (first.price + rest.price), tickets: [first, rest.tickets].flat()};
        }else if(rest !== undefined && trip === undefined){
          trip = {price: (first.price + rest.price), tickets: [first, rest.tickets].flat()};
        }
      }
    }

    return trip;
  }else if(cities.length == 1){
    let trip = undefined;

    let first = findCheapestTicketWithDestination(`${origin}`, date, cities[0].id, data, directOnly);

    if(first !== undefined){
      let newDate = new Date(date);
      newDate.setDate(newDate.getDate() + cities[0].nights);

      let last = findCheapestTicketWithDestination(cities[0].id, newDate, finalOrigin, data, directOnly);

      if(last !== undefined){
        trip = {price: (first.price + last.price), tickets: [first, last].flat()};
      }
    }

    return trip;
  }else{
    return undefined;
  }
}

//  search engine's main function
export function searchEngine(origin, data, filter){
  let result = [];

  if(origin != undefined && data != undefined && filter != undefined){
    let directOnly = true;

    let cities = filter.filter( (item) => item.selected && item.nights != 0 );

    let dateLong = 0;
    cities.forEach( (item) => dateLong += item.nights );
    let lastDay = new Date(data[0].day);
    lastDay.setDate(lastDay.getDate() + dateLong);

    let date = new Date(data[0].day);

    while(new Date(data[data.length-1].day).getTime() >= lastDay.getTime()){
      let trip = getCheapestTripOnSelectedDate(origin, origin, date, cities, data, directOnly);
      if(trip != undefined) result.push(trip);
      lastDay.setDate(lastDay.getDate() + 1);
      date.setDate(date.getDate() + 1);
    }

  }

  return result;
}

/* ----- CALL FLIGHTS ----- */
// loading level
let loading;

// main call flights funtion
export async function flightsCall(data, update){
  loading = 0;
  let fromDate = new Date(data.fromDate);
  let toDate = new Date(data.toDate);
  let allId = [...data.destinations];
  allId.push(data.origin);

  let locations = [];
  allId.forEach( id => {
    let i=0;
    while(i<airports.length && airports[i].id != id) i++;
    if(i<airports.length) locations.push({location: id, airports: airports[i].air});
  });

  let total = 0;
  locations.forEach((item1, i) => {
    locations.forEach((item2, j) => {
      if(i !== j) total += (item1.airports.length * item2.airports.length);
    });
  });
  total = (total*(((toDate-fromDate) / (1000 * 3600 * 24))+1));

  while (fromDate.getTime() <= toDate.getTime()) {
    await searchFlights(fromDate, update, locations, total);
    fromDate.setDate(fromDate.getDate() + 1);
  }
}

// flights call's helper funtion with api request
async function searchFlights(currentDate, update, locations, total){
  let dayList = {day: currentDate.toISOString().split('T')[0], flights: []};

  for(let i=0; i<locations.length; i++){
    let flights = {origin: locations[i].location};
    let ticketList = [];

    for(let j=0; j<locations.length; j++){
      if(j != i){

        for(let l=0; l<locations[i].airports.length; l++){
          for(let k=0; k<locations[j].airports.length; k++){
            const result = await fetch(`https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browseroutes/v1.0/${"HU"}/${"USD"}/en-US/${locations[i].airports[l]}-sky/${locations[j].airports[k]}-sky/${currentDate.toISOString().split('T')[0]}`, {
            	"method": "GET",
            	"headers": headers
            })
            .catch(err => {
            	console.log(err);
            });

            const flight = await result.json();
            if(flight.errors == undefined) ticketList.push(generateTicket(flight, locations[j].location));
            loading++;
            update(total, loading);
          }
        }
      }
    }

    flights.tickets = ticketList.flat();
    flights.tickets = sortPrices(flights.tickets);
    dayList.flights.push(flights);
  }

  update(total, loading, dayList);
}

/* ----- CALL TICKETS ----- */
// main call tickets funtion
export async function ticketsCall(data, update){
  if(data.from.length == data.to.length && data.to.length == data.date.length && data.date.length == data.direct.length){
    for(let i=0; i<data.from.length; i++){
      const result = await fetch(`https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browseroutes/v1.0/${"HU"}/${"USD"}/en-US/${data.from[i]}-sky/${data.to[i]}-sky/${data.date[i]}`, {
        "method": "GET",
        "headers": headers
      })
      .catch(err => {
        console.log(err);
      });

      const flight = await result.json();

      if(flight.errors == undefined){
        let tickets = generateTicket(flight);
        let j = 0;
        while(j<tickets.length && tickets[j].direct == data.direct[i]) j++;
        if(j<tickets.length) update(tickets[j]);
      }
    }
  }
}
