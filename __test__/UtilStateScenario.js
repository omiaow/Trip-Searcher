// price sorting test cases
export const priceSortingScenario = [
  {
    input: [{price: 200}, {price: 100}, {price: 300}],
    output: [{price: 100}, {price: 200}, {price: 300}]
  },{
    input: [{price: 200}, {price: -100}, {price: 0}],
    output: [{price: -100}, {price: 0}, {price: 200}]
  },{
    input: [undefined, {price: -100}, {price: 0}],
    output: [{price: -100}, {price: 0}]
  },{
    input: [],
    output: []
  },{
    input: undefined,
    output: undefined
  }
];
