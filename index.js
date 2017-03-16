const exec = require('child_process').exec;
const babar = require('babar');

function PerformanceBudgetPlugin(options) {
  this.timeToFirstCss = options.timeToFirstCss || Infinity;
  this.timeToFirstJs = options.timeToFirstJs || Infinity;
  this.jsSize = options.jsSize || Infinity;
  this.cssSize = options.cssSize || Infinity;
  this.domInteractive = options.domInteractive || Infinity;
  this.domContentLoaded = options.domContentLoaded || Infinity;
  this.domComplete = options.domComplete || Infinity;
  this.metricsSummary = options.metricsSummary || false;
  this.numberOfRebuilds = options.numberOfRebuilds || 2;
}

const timeToFirstCss = [];
const cssSize = [];
const jsSize = [];
const timeToFirstJs = [];
const domInteractive = [];
const domContentLoaded = [];
const domComplete = [];
let count = 0;

PerformanceBudgetPlugin.prototype.apply = function apply(compiler) {
  compiler.plugin('done', () => {
    if (!compiler.options.devServer) {
     throw Error('performance-budget-plugin requires webpack-dev-server');
    };
    const host = compiler.options.devServer.host;
    const port = compiler.options.devServer.port;
    const url = `http://${ host }:${ port }`;
    const command = `node node_modules/phantomas/bin/phantomas.js ${ url } --reporter=json:pretty`;
    exec(command, (err, out) => {
      let result;

      try {
        result = JSON.parse(out);
      } catch (e) {
        console.error('Unable to parse performance metrics');
        return;
      }

      timeToFirstCss.push([ count, parseInt(result.metrics.timeToFirstCss) ]);
      timeToFirstJs.push([ count, parseInt(result.metrics.timeToFirstJs) ]);
      cssSize.push([ count, parseInt(result.metrics.cssSize) ]);
      jsSize.push([ count, parseInt(result.metrics.jsSize) ]);
      domInteractive.push([ count, parseInt(result.metrics.domInteractive) ]);
      domContentLoaded.push([ count, parseInt(result.metrics.domContentLoaded) ]);
      domComplete.push([ count, parseInt(result.metrics.domComplete) ]);
      count++;

      if (timeToFirstCss.length < this.numberOfRebuilds) {
        console.log(`Performance Plugin will output metrics after ${ this.numberOfRebuilds } rebuilds`);
        return;
      }

      console.log('\n\n');
      console.log(babar(timeToFirstCss, {
        minY: 0,
        minX: 0,
        color: result.metrics.timeToFirstCss > this.timeToFirstCss ? 'red' : 'green',
        caption: `Time to first CSS: ${ parseInt(result.offenders.timeToFirstCss) }`
      }));

      console.log('\n\n');
      console.log(babar(timeToFirstJs, {
        minY: 0,
        minX: 0,
        color: result.metrics.timeToFirstJs > this.timeToFirstJs ? 'red' : 'green',
        caption: `Time to first JS: ${ parseInt(result.offenders.timeToFirstJs) }`
      }));

      console.log('\n\n');
      console.log(babar(cssSize, {
        minY: 0,
        minX: 0,
        color: result.metrics.cssSize > this.cssSize ? 'red' : 'green',
        caption: `CSS size: Current size ${ parseInt(result.metrics.cssSize) }`
      }));

      console.log('\n\n');
      console.log(babar(jsSize, {
        minY: 0,
        minX: 0,
        color: result.metrics.jsSize > this.jsSize ? 'red' : 'green',
        caption: `JS size: Current size ${ parseInt(result.metrics.jsSize) }`
      }));

      console.log('\n\n');
      console.log(babar(domInteractive, {
        minY: 0,
        minX: 0,
        color: result.metrics.domInteractive > this.domInteractive ? 'red' : 'green',
        caption: `Time it took to parse the HTML and construct the DOM (domInteractive). Current: ${ parseInt(result.metrics.domInteractive) }`
      }));

      console.log('\n\n');
      console.log(babar(domContentLoaded, {
        minY: 0,
        minX: 0,
        color: result.metrics.domContentLoaded > this.domContentLoaded ? 'red' : 'green',
        caption: `Time it took to construct both DOM and CSSOM (domContentLoaded). Current: ${ parseInt(result.metrics.domContentLoaded) }`
      }));

      console.log('\n\n');
      console.log(babar(domComplete, {
        minY: 0,
        minX: 0,
        color: result.metrics.domComplete > this.domComplete ? 'red' : 'green',
        caption: `Time it took to load all page resources (domComplete). Current: ${ parseInt(result.metrics.domComplete) }`
      }));

      if (!this.metricsSummary) {
        console.log('\n\n');
        console.log('############### METRICS SUMMARY #################');
      }

      if (this.metricsSummary === 'minimal' || this.metricsSummary === true) {
        console.log(result.metrics);
      } else if (this.metricsSummary === 'verbose') {
        console.log(result);
      }
    });
  });
};

module.exports = PerformanceBudgetPlugin;