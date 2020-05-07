const _ = require('lodash');
const { google } = require('googleapis');

class Spreadsheet {
  constructor(client, spreadsheetId) {
    this.client = client;
    this.spreadsheetId = spreadsheetId;
  }

  static async build(spreadsheetId) {
    const auth = new google.auth.GoogleAuth({
      keyFilename: 'googleapi-credential.secret.json',
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const authClient = await auth.getClient();
    const { spreadsheets } = google.sheets({ version: 'v4', auth: authClient });
    return new Spreadsheet(spreadsheets.values, spreadsheetId);
  }

  async fetchSymbols() {
    const { data } = await this.client.get({
      spreadsheetId: this.spreadsheetId,
      range: 'Summary!A3:A',
    });
    return _.flatten(data.values);
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

module.exports = Spreadsheet;
