const _ = require('lodash');
const fs = require('fs');

const Spreadsheet = require('./Spreadsheet');

const computeAvgBuyPrice = (symbol, history) => {
  const head = history[0];
  const colIndices = {};
  head.map((item, i) => (colIndices[item] = i));

  const items = history
    .filter((item) => item[colIndices.Symbol] === symbol)
    .map((item) => ({
      action: item[colIndices.Action],
      qty: parseInt(item[colIndices.Qty].replace(/,/, '')),
      price: parseFloat(
        item[colIndices.Price].replace(/[$₩]/, '').replace(/,/, '')
      ),
    }));

  const buyItems = items.filter((item) => item.action === 'Buy');
  const sellItems = items.filter((item) => item.action === 'Sell');

  const filteredBuyItems = [...buyItems];
  let bi = 0;
  sellItems.forEach(({ qty }) => {
    let remaining = qty;
    while (remaining > 0) {
      if (remaining > filteredBuyItems[bi].qty) {
        remaining -= filteredBuyItems[bi].qty;
        filteredBuyItems[bi].qty = 0;
        ++bi;
      } else {
        filteredBuyItems[bi].qty -= remaining;
        remaining = 0;
      }
    }
  });

  const qty = filteredBuyItems.reduce((sum, i) => sum + i.qty, 0);
  const price = filteredBuyItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  return qty === 0 ? 0 : price / qty;
};

async function main(market) {
  const config = JSON.parse(fs.readFileSync(`invest-${market}.secret.json`));
  const spreadsheet = await Spreadsheet.build(config.spreadsheet_id, 'A', 'F');

  const symbols = await spreadsheet.fetchSymbols();
  const history = await spreadsheet.fetchHistory();

  const avgBuyPrices = symbols.map((symbol) =>
    computeAvgBuyPrice(symbol, history)
  );

  await spreadsheet.updateAvgBuyPrices(avgBuyPrices);

  _.zip(symbols, avgBuyPrices).forEach(([symbol, price]) =>
    console.log(`${symbol}: ${price}`)
  );
}

main(process.argv[2]);
