# Coinbase JS

[![npm](https://img.shields.io/npm/v/coinbase-js.svg)](https://www.npmjs.com/package/coinbase-js)
[![license](https://img.shields.io/npm/l/coinbase-js.svg)](https://github.com/dguo/coinbase-js/blob/main/LICENSE.txt)
[![bundle size](https://img.shields.io/bundlephobia/minzip/coinbase-js)](https://bundlephobia.com/result?p=coinbase-js)
[![continuous integration status](https://github.com/dguo/coinbase-js/actions/workflows/continuous-integration.yaml/badge.svg)](https://github.com/dguo/coinbase-js/actions/workflows/continuous-integration.yaml)
[![test coverage](https://codecov.io/gh/dguo/coinbase-js/branch/main/graph/badge.svg)](https://codecov.io/gh/dguo/coinbase-js)
[![known vulnerabilities](https://snyk.io/test/github/dguo/coinbase-js/badge.svg?targetFile=package.json)](https://snyk.io/test/github/dguo/coinbase-js?targetFile=package.json)

Node.js client for [Coinbase](https://www.coinbase.com/)'s
[API](https://developers.coinbase.com/). This client covers the regular API. For
the [Coinbase Pro API](https://developers.coinbase.com/docs/exchange), check out
[this client](https://bennycode.com/coinbase-pro-node) instead.

This is a work in progress. Significant changes and documentation are incoming.

## Installation

```sh
npm install --save coinbase-js
```

or

```sh
yarn add coinbase-js
```

## Usage

```javascript
import {Coinbase} from "coinbase-js";

const apiToken = "<your token>";
const apiSecret = "<your secret>";
const coinbase = new Coinbase({apiToken, apiSecret});
```

## License

MIT
