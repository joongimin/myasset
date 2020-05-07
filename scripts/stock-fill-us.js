const _ = require('lodash');
const fs = require('fs');
const axios = require('axios');

const Spreadsheet = require('./Spreadsheet');

async function fetchStockPrice(symbol) {
  const url = `https://finance.yahoo.com/quote/${symbol}/`;
  const maxTries = 10;
  let tries = 0;
  while (true) {
    try {
      const { data } = await axios.get(url);
      const price = parseFloat(
        data
          .split(`"${symbol}":{"sourceInterval"`)[1]
          .split('regularMarketPrice')[1]
          .split('fmt":"')[1]
          .split('"')[0]
          .replace(/,/g, '')
      );
      return price;
    } catch (err) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (++tries === maxTries) {
        console.log(`Failed to get price for symbol '${symbol}'`);
        throw err;
      }
    }
  }
}

async function main() {
  const config = JSON.parse(fs.readFileSync('stock-fill-us.secret.json'));

  const spreadsheet = await Spreadsheet.build(config.spreadsheet_id, 'A', 'F');
  const symbols = await spreadsheet.fetchSymbols();
  const prices = await Promise.all(
    symbols.map((symbol) => fetchStockPrice(symbol))
  );
  await spreadsheet.updatePrices(prices);
  _.zip(symbols, prices).forEach(([symbol, price]) =>
    console.log(`${symbol}: ${price}`)
  );
}

main();
