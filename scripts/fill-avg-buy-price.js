const _ = require('lodash');
const fs = require('fs');

const Spreadsheet = require('./Spreadsheet');

const computeAvgBuyPrice = (symbol, history) => {
  const head = history[0];
  const colIndices = {};
  head.map((item, i) => (colIndices[item] = i));

  const itemsSymbol = history.filter(
    (item) => item[colIndices.Symbol] === symbol
  );
  if (!itemsSymbol.length) return 0;

  const items = itemsSymbol.map((item) => ({
    action: item[colIndices.Action],
    qty: parseInt(item[colIndices.Qty].replace(/,/, '')),
    price: parseFloat(
      item[colIndices.Price].replace(/[$₩]/, '').replace(/,/, '')
    ),
  }));

  let startIdx = 0;
  let balance = 0;
  items.forEach((item, i) => {
    if (item.action === 'Buy') balance += item.qty;
    else {
      balance -= item.qty;
      if (balance === 0) startIdx = i + 1;
    }
  });

  let totalQty = 0;
  let totalPrice = 0;
  for (let i = startIdx; i < items.length; ++i) {
    const { qty, price, action } = items[i];
    if (action === 'Buy') {
      totalQty += qty;
      totalPrice += price * qty;
    } else {
      totalQty -= qty;
      totalPrice -= price * qty;
    }
  }

  return totalQty === 0 ? 0 : totalPrice / totalQty;
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
