const _ = require('lodash');
const fs = require('fs');
const axios = require('axios');
const { JSDOM } = require('jsdom');

const Spreadsheet = require('./Spreadsheet');

async function fetchStockPrice(symbol) {
  const url = `https://finance.naver.com/item/main.nhn?code=${symbol}`;
  const maxTries = 1;
  let tries = 0;
  while (true) {
    try {
      const { data } = await axios.get(url);
      const dom = new JSDOM(data);
      const priceText = dom.window.document.querySelector('.no_today .blind')
        .textContent;
      return parseInt(priceText.replace(/,/g, ''));
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
  const config = JSON.parse(fs.readFileSync('stock-fill-kr.secret.json'));

  const spreadsheet = await Spreadsheet.build(config.spreadsheet_id, 'B', 'G');
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
