/* eslint no-console: 0 */
const babar = require('babar');

const timeToFirstCss = [];
const cssSize = [];
const jsSize = [];
const timeToFirstJs = [];
const domInteractive = [];
const domContentLoaded = [];
const domComplete = [];
let count = 0;


/**
 * Display results
 *
 * @param {object} result
 * @param {array} validOptions
 */
function report(result, validOptions) {
  if (validOptions.length === 0) {
    timeToFirstCss.push([ count, parseInt(result.metrics.timeToFirstCss) ]);
    timeToFirstJs.push([ count, parseInt(result.metrics.timeToFirstJs) ]);
    cssSize.push([ count, parseInt(result.metrics.cssSize) ]);
    jsSize.push([ count, parseInt(result.metrics.jsSize) ]);
    domInteractive.push([ count, parseInt(result.metrics.domInteractive) ]);
    domContentLoaded.push([ count, parseInt(result.metrics.domContentLoaded) ]);
    domComplete.push([ count, parseInt(result.metrics.domComplete) ]);

    console.log('\n\n');
    console.log(babar(timeToFirstCss, {
      minY: 0,
      minX: 0,
      color: result.metrics.timeToFirstCss > validOptions.timeToFirstCss ? 'red' : 'green',
      caption: `Time to first CSS: ${ result.offenders.timeToFirstCss }`
    }));

    console.log('\n\n');
    console.log(babar(timeToFirstJs, {
      minY: 0,
      minX: 0,
      color: result.metrics.timeToFirstJs > validOptions.timeToFirstJs ? 'red' : 'green',
      caption: `Time to first JS: ${ result.offenders.timeToFirstJs }`
    }));

    console.log('\n\n');
    console.log(babar(cssSize, {
      minY: 0,
      minX: 0,
      color: result.metrics.cssSize > validOptions.cssSize ? 'red' : 'green',
      caption: `CSS size: Current size ${ parseInt(result.metrics.cssSize) }`
    }));

    console.log('\n\n');
    console.log(babar(jsSize, {
      minY: 0,
      minX: 0,
      color: result.metrics.jsSize > validOptions.jsSize ? 'red' : 'green',
      caption: `JS size: Current size ${ parseInt(result.metrics.jsSize) }`
    }));

    console.log('\n\n');
    console.log(babar(domInteractive, {
      minY: 0,
      minX: 0,
      color: result.metrics.domInteractive > validOptions.domInteractive ? 'red' : 'green',
      caption: `Time it took to parse the HTML and construct the DOM (domInteractive). Current: ${ parseInt(result.metrics.domInteractive) }`
    }));

    console.log('\n\n');
    console.log(babar(domContentLoaded, {
      minY: 0,
      minX: 0,
      color: result.metrics.domContentLoaded > validOptions.domContentLoaded ? 'red' : 'green',
      caption: `Time it took to construct both DOM and CSSOM (domContentLoaded). Current: ${ parseInt(result.metrics.domContentLoaded) }`
    }));

    console.log('\n\n');
    console.log(babar(domComplete, {
      minY: 0,
      minX: 0,
      color: result.metrics.domComplete > validOptions.domComplete ? 'red' : 'green',
      caption: `Time it took to load all page resources (domComplete). Current: ${ parseInt(result.metrics.domComplete) }`
    }));
  } else {
    validOptions.forEach(option => {
      option.arr.push([ count, parseInt(result.metrics[option.name]) ]);
      if (option.arr.length >= 2) {
        console.log('\n\n');
        console.log(babar(option.arr, {
          minY: 0,
          minX: 0,
          color: result.metrics[option.name] > option.value ? 'red' : 'green',
          caption: `${ option.name }`
        }));
      }
    });
    count++;
  }
}

module.exports = report;

