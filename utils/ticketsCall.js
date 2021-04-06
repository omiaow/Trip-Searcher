import { generateTicket } from './tools.js';
import { headers } from './api-key.js';

export default async function show(data, update){

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
