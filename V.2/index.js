import express, { response } from "express";
import cors from "cors"

//Airtable
import getGoals from "./Airtable/getGoals.js";
import getOtherDonations from "./Airtable/getOtherDonations.js";
import {updateGoal, GoalStatus} from "./Airtable/updateGoal.js";

//musikhjalpen
import {getAmountDonated} from './musikhjalpen/getAmountDonated.js'

//shopify
import getAmountFromShopify from './shopify/getOrders.js'

import auctionHandler from "./auctionHandler.js";

//Settings
const auctionLoopTime = 60000 //60000 is 1 minute
const fetchLoopTime = 5000 //60000 is 1 minute

//DATA TABLE
var shopifyAmount = 0;
var musikhjalpenAmount = 0;
var otherAmount = 0;
var totalAmountCollected = 0;

var triggers = []
var currentTriggerIndex = -1;

var totalAmountToCurrentTrigger = 0
var amountCollectedTowardsCurrentTrigger = 0
var amountLeftToCollectToCurrentTrigger = 0
var currentProgress = 0


var auctionLoop = setInterval(function(){
    auctionHandler()
}, auctionLoopTime)

var fetchLoop = setInterval(function(){
    Promise.all([getAmountFromShopify(), getAmountDonated(), getOtherDonations(), getGoals()]).then((values) => {
    shopifyAmount = values[0]
    musikhjalpenAmount = values[1]
    otherAmount = values[2].map(donation => donation.amount).reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    
    totalAmountCollected = shopifyAmount + musikhjalpenAmount + otherAmount

    triggers = values[3].sort((a,b) => a.TriggerPrice - b.TriggerPrice)
    triggers.unshift({
        id: 'add',
        TriggerTitle: 'Lets get this party started!',
        TriggerDescription: "No previous triggers",
        TriggerPrice: 0,
        status: undefined
    })
    triggers.push({
        id: 'add',
        TriggerTitle: 'Amazing work!',
        TriggerDescription: "WOW! We have broken the goal for the fundraiser but why stop there, lets se how far we can go!",
        TriggerPrice: 1000000,
        status: undefined
    })

    currentTriggerIndex = triggers.findIndex(trigger => trigger.TriggerPrice > totalAmountCollected)
    if(currentTriggerIndex == triggers.length - 1) {
        triggers.push({
            id: 'add',
            TriggerTitle: '',
            TriggerDescription: "",
            TriggerPrice: 0,
            status: undefined
        })
    }

    triggers.map((trigger, index) => {
        if(trigger.id == "add") {
            return
        }

        if(index < currentTriggerIndex) {
            if(trigger.status != GoalStatus.DONE) {
                updateGoal(trigger.id, GoalStatus.DONE)
                trigger.status = GoalStatus.DONE
            }
        }

        if(index == currentTriggerIndex) {
            if(trigger.status != GoalStatus.CURRENT) {
                updateGoal(trigger.id, GoalStatus.CURRENT)
                trigger.status = GoalStatus.CURRENT
            }
        }

        if(index > currentTriggerIndex) {
            if(trigger.status != GoalStatus.NEXT) {
                updateGoal(trigger.id, GoalStatus.NEXT)
                trigger.status = GoalStatus.NEXT
            }
        }
    })

    totalAmountToCurrentTrigger = triggers[currentTriggerIndex].TriggerPrice - triggers[currentTriggerIndex - 1].TriggerPrice
    amountCollectedTowardsCurrentTrigger = totalAmountCollected - triggers[currentTriggerIndex - 1].TriggerPrice
    amountLeftToCollectToCurrentTrigger = totalAmountToCurrentTrigger - amountCollectedTowardsCurrentTrigger
    currentProgress = amountCollectedTowardsCurrentTrigger / totalAmountToCurrentTrigger
    });
}, fetchLoopTime)

const app = express();
const PORT = parseInt(process.env.PORT) || 8080;

var whitelist = ['https://rkbs.se', 'https://jstudent.myshopify.com', 'https://radiokbryrsig.se']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors(corsOptions))

app.get('/', (request, response) => {

    var res = {
        "TotalAmountCollected": totalAmountCollected,
        "previousTrigger": triggers[currentTriggerIndex - 1],
        "currentTrigger": triggers[currentTriggerIndex],
        "nextTrigger": triggers[currentTriggerIndex + 1],
        "totalAmountNeededToNextTrigger": totalAmountToCurrentTrigger,
        "amountCollectedTowardsCurrentTrigger": amountCollectedTowardsCurrentTrigger,
        "amountLeftToCollectToCurrentTrigger": amountLeftToCollectToCurrentTrigger,
        "currentProgress": currentProgress
    }

    response.send(res)
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
})