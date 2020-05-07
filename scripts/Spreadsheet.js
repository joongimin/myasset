const _ = require('lodash');
const { google } = require('googleapis');

class Spreadsheet {
  constructor(client, spreadsheetId, symbolCol, priceCol) {
    this.client = client;
    this.spreadsheetId = spreadsheetId;
    this.symbolCol = symbolCol;
    this.priceCol = priceCol;
  }

  static async build(...args) {
    const auth = new google.auth.GoogleAuth({
      keyFilename: 'googleapi-credential.secret.json',
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const authClient = await auth.getClient();
    const { spreadsheets } = google.sheets({ version: 'v4', auth: authClient });
    return new Spreadsheet(spreadsheets.values, ...args);
  }

  async fetchSymbols() {
    const { data } = await this.client.get({
      spreadsheetId: this.spreadsheetId,
      range: `Summary!${this.symbolCol}3:${this.symbolCol}`,
    });
    return _.flatten(data.values);
  }

  async updatePrices(prices) {
    const range = `Summary!${this.priceCol}3:${this.priceCol}${
      2 + prices.length
    }`;
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

module.exports = Spreadsheet;
