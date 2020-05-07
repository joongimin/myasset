const fs = require('fs');
const { google } = require('googleapis');
const axios = require('axios');

class Spreadsheet {
  constructor(client) {
    this.client = client;

    const config = JSON.parse(fs.readFileSync('stock-fill.secret.json'));
    this.spreadsheetId = config.spreadsheet_id;
  }

  static async build() {
    const auth = new google.auth.GoogleAuth({
      keyFilename: 'googleapi-credential.secret.json',
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const authClient = await auth.getClient();
    const { spreadsheets } = google.sheets({ version: 'v4', auth: authClient });
    return new Spreadsheet(spreadsheets.values);
  }

  async fetchSymbols() {
    const { data } = await this.client.get({
      spreadsheetId: this.spreadsheetId,
      range: 'Summary!A3:A',
    });
    return data.values;
  }

  async updatePrices(prices) {
    const range = `Summary!F3:F${2 + prices.length}`;
    await this.client.update({
      spreadsheetId: this.spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      resource: {
        range,
        values: prices.map((p) => [p]),
      },
    });
  }
}

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
  const spreadsheet = await Spreadsheet.build();
  const symbols = await spreadsheet.fetchSymbols();
  const prices = await Promise.all(
    symbols.map((symbol) => fetchStockPrice(symbol))
  );
  await spreadsheet.updatePrices(prices);
}

main();
