import {sortPrices} from '../utils/state';
import {priceSortingScenario} from './UtilStateScenario';

// price sorting functio
test("price sorting function", () => {
  for(let i=0; i<priceSortingScenario.length; i++)
    expect(sortPrices(priceSortingScenario[i].input)).toEqual(priceSortingScenario[i].output);
});
