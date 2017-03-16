<div align="center">
  <h1><code>performance-budget-plugin</code> for webpack</h1>
</div>

Measure the impact of your changes to the performance of your application.
The plugin works with the help of `webpack dev server` and gathers metrics between
the re-builds (every time you make some changes in your codebase). It is recommended to have
the hot module replacement turn off when you use this plugin.

[![forthebadge](http://forthebadge.com/images/badges/built-with-love.svg)](http://forthebadge.com)


## Install

`npm install performance-budget-plugin [--save-dev]`

## Setup

```js
// webpack.config.js

var PerformanceBudgetPlugin = require('performance-budget-plugin');

module.exports = {
  // ...

  plugins: [
    new PerformanceBudgetPlugin({
      timeToFirstCss: 500, // ms, default: Infinity
      timeToFirstJs: 1500, // ms, default: Infinity
      jsSize: 50000, // bytes, default: Infinity
      cssSize: 30000, // bytes, default: Infinity
      domInteractive: 6000, // ms, default: Infinity
      domContentLoaded: 7000, // ms, default: Infinity
      domComplete: 8000, // ms, default: Infinity
      metricsSummary: 'minimal' // options: [verbose, minimal, true, false], default: false,
      numberOfRebuilds: 3 // number of rebuilds before displaying metrics, default 2
    })
  ]
  // ...
}

```

### Results

A little while after webpack finishes the compilation you will get in your terminal impacts of your changes. e.g.

<a href="https://ibb.co/jqrRrF"><img src="https://image.ibb.co/gsOHyv/Screen_Shot_2017_03_16_at_18_36_40.png" alt="Screen_Shot_2017_03_16_at_18_36_40" border="0" width="400"></a><br /><br />


Passing `minimal` as value of the `metricsSummary` option will give you some more info about your application.

<a href="https://ibb.co/jVgnyv"><img src="https://image.ibb.co/hvMWQa/Screen_Shot_2017_03_16_at_18_41_19.png" alt="Screen_Shot_2017_03_16_at_18_41_19" border="0" width="300"></a><br /><br />

Passing `verbose` you will get some more in-depth info.

<a href="https://ibb.co/gNQfJv"><img src="https://image.ibb.co/jCArQa/Screen_Shot_2017_03_16_at_18_45_52.png" alt="Screen_Shot_2017_03_16_at_18_45_52" border="0" width="600"></a><br /><br />

## Options

All options are optional. See explanation on example.


## Like `performance-budget-plugin`?

Support it by giving [feedback](https://github.com/AvraamMavridis/performance-budget-plugin/issues), contributing or just by 🌟 starring the project!

### Contribute

Any pull-request is more than welcome :boom: :smile:

This project adheres to the Contributor Covenant [code of conduct](http://contributor-covenant.org/). By participating, you are expected to uphold this code.


### Contact

twitter: @avraamakis


## License

MIT
