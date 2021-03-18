
// Finding Cheapest Ticket
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

// Recursive Function To Find Chapest Cycle
function getCheapestTripOnSelectedDate(origin, finalOrigin, date, cities, data, directOnly, interval){
  if(cities.length > 1){

    let trip = undefined;

    for(let i=0; i<cities.length; i++){
      let first = findCheapestTicketWithDestination(`${origin}`, date, cities[i].id, data, directOnly);

      if(first !== undefined){
        for(let d=cities[i].nights-interval; d<=cities[i].nights+interval; d++){
          if(d > 0){
            let restCities = cities.filter( (item) => item.id !== cities[i].id );

            let newDate = new Date(date);
            newDate.setDate(newDate.getDate() + d);

            let rest = getCheapestTripOnSelectedDate(`${cities[i].id}`, finalOrigin, newDate, restCities, data, directOnly, interval);

            if(rest !== undefined && trip !== undefined && trip.price > (first.price + rest.price)){
              trip = {price: (first.price + rest.price), tickets: [first, rest.tickets].flat()};
            }else if(rest !== undefined && trip === undefined){
              trip = {price: (first.price + rest.price), tickets: [first, rest.tickets].flat()};
            }

          }
        }
      }
    }

    return trip;

  }else if(cities.length == 1){

    let trip = undefined;

    let first = findCheapestTicketWithDestination(`${origin}`, date, cities[0].id, data, directOnly);

    if(first !== undefined){
      for(let d=cities[0].nights-interval; d<=cities[0].nights+interval; d++){
        if(d > 0){
          let newDate = new Date(date);
          newDate.setDate(newDate.getDate() + d);

          let last = findCheapestTicketWithDestination(cities[0].id, newDate, finalOrigin, data, directOnly);

          if(last !== undefined && trip !== undefined && trip.price > (first.price + last.price)){
            trip = {price: (first.price + last.price), tickets: [first, last].flat()};
          }else if(last !== undefined && trip === undefined){
            trip = {price: (first.price + last.price), tickets: [first, last].flat()};
          }
        }
      }
    }

    return trip;

  }else{
    return undefined;
  }
}

// Start Engine
export default function searchEngine(origin, data, filter){

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
      let trip = getCheapestTripOnSelectedDate(origin, origin, date, cities, data, directOnly, 1);
      if(trip != undefined) result.push(trip);
      lastDay.setDate(lastDay.getDate() + 1);
      date.setDate(date.getDate() + 1);
    }

  }

  return result;

}
