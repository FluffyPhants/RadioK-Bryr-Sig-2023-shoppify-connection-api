import { google } from "googleapis";

import {authorize} from './authorization.js'

 async function fetchListTriggers(auth) {
  try {
    const sheets = google.sheets({version: 'v4', auth});
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: '1PXddUEBf7RFHVURWg2TDedsiM3tofhIW-2TsHiuKNbo',
      range: 'triggers!A2:C',
    });
    const rows = res.data.values;
    if (!rows || rows.length === 0) {
      console.log('No data found.');
      return;
    }
    return rows
  } catch (error) {
      console.log("error in fetchListTriggers");
      return;
  }
}

async function fetchOtherDonations(auth) {
  try {
    const sheets = google.sheets({version: 'v4', auth});
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: '1PXddUEBf7RFHVURWg2TDedsiM3tofhIW-2TsHiuKNbo',
      range: 'donations!A2:A',
    });
    const rows = res.data.values;
    if (!rows || rows.length === 0) {
      console.log('No data found.');
      return;
    }
    return rows
  } catch (error) {
      console.log("error in fetchOtherDonations");
      return;
  }
}

async function changeRowColor(auth, row, color) {
    const request = {
        requests: [
            {
                "repeatCell": {
                "range": {
                    "sheetId": 0,
                    "startColumnIndex": 0,
                    "endColumnIndex": 3,
                    "startRowIndex": row-1,
                    "endRowIndex": row
                },
                "cell": {
                    "userEnteredFormat": {
                        "backgroundColor": color
                    }
                },
                "fields": "userEnteredFormat"
            }}
        ]
    };

    const sheets = google.sheets({version: 'v4', auth});
    sheets.spreadsheets.batchUpdate({ 
        spreadsheetId: "1PXddUEBf7RFHVURWg2TDedsiM3tofhIW-2TsHiuKNbo", 
        requestBody: request, auth 
    }, //whis error respons function needs to be filled with error handling TODO
        function(err, response) {
          if (err) {
            console.error(err);
            return;
          } else {
            //console.info(response);

            if(color == colors.Red){
              console.log( `Sucessfully colored Row ${row} red`)
            } else if (color == colors.Yellow) {
              console.log( `Sucessfully colored Row ${row} yellow`)
            } else {
              console.log( `Sucessfully colored Row ${row} green`)
            }
          }
        }
      );
}

const colors = Object.freeze({
  Red: {
    "red": 1,
    "green": 0,
    "blue": 0
  },
  Yellow: {
    "red": 1,
    "green": 1,
    "blue": 0
  }, 
  Green: {
    "red": 0,
    "green": 1,
    "blue": 0
  }
})

async function changeColorOfRow(row, color) {
  authorize().then(auth => {
    changeRowColor(auth, row, color)
  }).catch(/*do something*/)
}

async function getTriggerList() {
    return authorize().then(auth => {
      return fetchListTriggers(auth)
    }).catch(/*do something*/)
}

async function getOtherDonations() {
  return authorize().then(auth => {
    return fetchOtherDonations(auth)
  }).catch(/*do something*/)
}

export {getTriggerList, getOtherDonations, changeColorOfRow, colors};