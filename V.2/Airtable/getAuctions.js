import base from './restClient.js';

async function getAuctions() {
    let auctions = []
    await new Promise((resolve, reject) => {
        base('tblV7bxZEaXPdjOSg').select({
            // Selecting the first 3 records in Grid view:
            maxRecords: 6,
            view: "Grid view"
        }).eachPage(function page(records, fetchNextPage) {
            // This function (`page`) will get called for each page of records.
        
            records.forEach(function (record) {
                const auctionTag = record.get('Auction Tag');
                const originalDate = record.get('Auction time');
                if(originalDate == undefined) {
                    console.log('No auction time for', auctionTag);
                    return;
                }

                const formattedDate = new Date(originalDate).toISOString();

                const auction = {
                    tag: auctionTag,
                    time: formattedDate
                }
                auctions.push(auction);

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
    return auctions;
}

export default getAuctions;