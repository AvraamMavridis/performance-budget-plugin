/* eslint no-console: 0 */
const exec = require('child_process').exec;
const fs = require('fs');
const report = require('./report');
const validOptions = require('./validOptions');
const colors = require('colors');


/**
 * PerformanceBudgetPlugin constructor
 *
 * @param {any} [options={}]
 */
function PerformanceBudgetPlugin(options = {}) {
  this.validOptions = Object.keys(options);

  if (this.validOptions.length === 0) {
    this.validOptions.push('domInteractive', 'domContentLoaded', 'domComplete');
  }
  this.validOptions = this.validOptions.filter((option) => option !== 'metricsSummary' && option !== 'numberOfRebuilds');
  this.validOptions = this.validOptions.filter(option => validOptions.indexOf(option) > -1);

  this.validOptions = this.validOptions.map((option) => {
    return {
      name: option,
      value: options[option] || Infinity,
      arr: []
    };
  });
  this.metricsSummary = options.metricsSummary || false;
  this.numberOfRebuilds = options.numberOfRebuilds || 2;
}


PerformanceBudgetPlugin.prototype.apply = function apply(compiler) {
  let count = 0;
  compiler.plugin('done', () => {
    if (!compiler.options.devServer) {
      throw Error('[performance-budget-plugin]: requires webpack-dev-server');
    }
    const host = compiler.options.devServer.host;
    const port = compiler.options.devServer.port;
    const url = `http://${ host }:${ port }`;
    const commandJSON = `node node_modules/phantomas/bin/phantomas.js ${ url } --reporter=json:pretty > performance-budget.json`;

    count++;
    if (count < this.numberOfRebuilds + 1) {
      console.log('\n');
      console.log(colors.bgYellow.black(`[performance-budget-plugin]: Will output metrics after ${ this.numberOfRebuilds } rebuilds`));
      return;
    }

    exec(commandJSON, (err) => {
      if (err) {
        console.log('\n\n');
        console.error(colors.bgRed.black('[performance-budget-plugin]: Unable to execute perfomance analysis'));
        return;
      }
      fs.readFile('performance-budget.json', (error, jsondata) => {
        try {
          const result = JSON.parse(jsondata);
          report(result, this.validOptions);

          if (this.metricsSummary) {
            console.log('\n\n');
            console.log(colors.bgYellow.black('############### METRICS SUMMARY #################'));
          }

          if (this.metricsSummary === 'minimal' || this.metricsSummary === true) {
            console.log(result.metrics);
          } else if (this.metricsSummary === 'verbose') {
            console.log(result);
          }
          fs.unlink('performance-budget.json');
        } catch (e) {
          console.error(colors.bgRed.black('[performance-budget-plugin]: Unable to parse performance metrics'));
        }
      }
    );
    });
  });
};

module.exports = PerformanceBudgetPlugin;
