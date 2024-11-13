import base from './restClient.js';

async function getGoals() {
    let goals = []
    await new Promise((resolve, reject) => {
        base('tblBA9XyHm9VNkDs7').select({
            // Selecting the first 3 records in Grid view:
            maxRecords: 6,
            view: "Grid view"
        }).eachPage(function page(records, fetchNextPage) {
            // This function (`page`) will get called for each page of records.
        
            records.forEach(function (record) {
                if(record.get('Goal Amount') == undefined || record.get('Goal Name') == undefined) {
                    return;
                }
                const trigger = {
                    id: record.id,
                    TriggerTitle: record.get('Goal Name'),
                    TriggerDescription: record.get('Goal Description'),
                    TriggerPrice: record.get('Goal Amount'),
                    status: record.get('Status')
                }
                goals.push(trigger);
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
    return goals;
}

export default getGoals;