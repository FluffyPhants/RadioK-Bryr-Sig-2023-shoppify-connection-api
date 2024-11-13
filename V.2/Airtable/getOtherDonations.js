import base from './restClient.js';

async function getOtherDonations() {
    let donations = []
    await new Promise((resolve, reject) => {
        base('tblQZxUymSwWBk7Fw').select({
            // Selecting the first 3 records in Grid view:
            maxRecords: 6,
            view: "Grid view"
        }).eachPage(function page(records, fetchNextPage) {
            // This function (`page`) will get called for each page of records.
        
            records.forEach(function (record) {
                if(record.get('Donation Amount') != undefined) {
                    donations.push({
                        name: record.get('Donor Name'),
                        amount: record.get('Donation Amount')
                    });
                }
            });
        
            // To fetch the next page of records, call `fetchNextPage`.
            // If there are more records, `page` will get called again.
            // If there are no more records, `done` will get called.
            fetchNextPage();
        
        }, function done(err) {
            if (err) { 
                console.error(err);
                reject(err);
                return; 
            }
            resolve();
        });
    });
    return donations;
}

export default getOtherDonations