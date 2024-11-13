import base from './restClient.js';

const GoalStatus = Object.freeze({
    DONE: 'Done',
    NEXT: 'Next',
    CURRENT: 'Current'
});

function updateGoal(id, status) {
    base('tblBA9XyHm9VNkDs7').update([
        {
            "id": id,
            "fields": {
                "Status": status
            }
        }
  ], function(err, records) {
    if (err) {
      console.error(err);
      return;
    }
  });
}

export {updateGoal, GoalStatus}