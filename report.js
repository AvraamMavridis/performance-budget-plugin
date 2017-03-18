/* eslint no-console: 0 */
const babar = require('babar');

let count = 0;

/**
 * Display results
 *
 * @param {object} result
 * @param {array} validOptions
 */
function report(result, validOptions) {
  this.validOptions = this.validOptions || validOptions;
  this.validOptions.forEach(option => {
    option.arr.push([ count, parseInt(result.metrics[option.name]) ]);
    if (option.arr.length >= 2) {
      console.log('\n\n');
      console.log(babar(option.arr, {
        minY: 0,
        minX: 0,
        color: result.metrics[option.name] > option.value ? 'red' : 'green',
        caption: `${ option.name }, latest ${ result.metrics[option.name] }`
      }));
    }
  });
  count++;
}

module.exports = report;

