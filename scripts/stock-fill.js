const fs = require('fs');
const { google } = require('googleapis');

async function main(spreadsheetId) {
  const auth = new google.auth.GoogleAuth({
    keyFilename: 'googleapi-credential.secret.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const authClient = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: authClient });
  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Summary!A3:A',
  });
  data.values.forEach((v) => console.log(v));
  sheets.spreadsheets.values.update({
    spreadsheetId,
    range: 'Summary!B3',
    valueInputOption: 'USER_ENTERED',
    resource: { values: [['10.12']] },
  });
}

const config = JSON.parse(fs.readFileSync('stock-fill.secret.json'));
main(config.spreadsheet_id);
