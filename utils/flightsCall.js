import AirportsList from './airports.json';
import { sortPrices, generateTicket } from './tools.js';

import { headers } from './api-key.js';

let loading;

export default async function SearchCall(data, update){
  loading = 0;
  let fromDate = new Date(data.fromDate);
  let toDate = new Date(data.toDate);
  let allId = [...data.destinations];
  allId.push(data.origin);

  let locations = [];
  allId.forEach( id => {
    let i=0;
    while(i<AirportsList.length && AirportsList[i].id != id) i++;
    if(i<AirportsList.length) locations.push({location: id, airports: AirportsList[i].air});
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
