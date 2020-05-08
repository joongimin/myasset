const _ = require('lodash');
const { google } = require('googleapis');

class Spreadsheet {
  constructor(client, spreadsheetId) {
    this.client = client;
    this.spreadsheetId = spreadsheetId;
    this.colIdxMap = {};
  }

  static async build(spreadsheetId) {
    const auth = new google.auth.GoogleAuth({
      keyFilename: 'googleapi-credential.secret.json',
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const authClient = await auth.getClient();
    const { spreadsheets } = google.sheets({ version: 'v4', auth: authClient });
    const spreadsheet = new Spreadsheet(spreadsheets.values, spreadsheetId);
    await spreadsheet.loadColIdxMap('Summary');
    return spreadsheet;
  }

  async loadColIdxMap(worksheet) {
    const values = await this.fetchValues(`${worksheet}!1:1`);
    this.colIdxMap[worksheet] = values[0].reduce(
      (map, v, i) => ({
        ...map,
        [v]: String.fromCharCode(65 + i),
      }),
      {}
    );
  }

  async fetchValues(range) {
    const { data } = await this.client.get({
      spreadsheetId: this.spreadsheetId,
      range,
    });

    return data.values;
  }

  async updateValues(range, values) {
    await this.client.update({
      spreadsheetId: this.spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      resource: { range, values },
    });
  }

  async fetchSymbols() {
    const col = this.colIdxMap.Summary['Symbol'];
    const values = await this.fetchValues(`Summary!${col}3:${col}`);
    return _.flatten(values);
  }

  async fetchHistory() {
    const { data } = await this.client.get({
      spreadsheetId: this.spreadsheetId,
      range: 'History!A:F',
    });
    return data.values;
  }

  async updatePrices(prices) {
    const col = this.colIdxMap.Summary['Cur Price'];
    await this.updateValues(
      `Summary!${col}3:${col}${2 + prices.length}`,
      prices.map((p) => [p])
    );
  }

  async updateAvgBuyPrices(values) {
    const col = this.colIdxMap.Summary['Avg Buy'];
    await this.updateValues(
      `Summary!${col}3:${col}${2 + values.length}`,
      values.map((v) => [v])
    );
  }
}

module.exports = Spreadsheet;
