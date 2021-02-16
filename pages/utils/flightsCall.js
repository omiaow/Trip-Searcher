import AirportsList from './airports.json';

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

            const result = await fetch(/* API Data was hidden */)
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
    dayList.flights.push(flights);
  }

  update(total, loading, dayList);

  function generateTicket(flight, locId){
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
}
