import axios from "axios";
import express, { response } from "express";

import {getAmountFromMusikhjalpen} from './musikhjalpen.js'
import {getAmountFromShopify} from './shopify.js'
import {getTriggerList, getOtherDonations, changeColorOfRow, colors} from "./googleSheets/CRUD.js";

import cors from "cors"


var amountShopify = 0;
var amountMusikhjalpen = 0;
var triggerList = []
var totalDonations = 0;

var currentTriggerIndex = -1;

let totalAmountCollected = 0
const currentTrigger = {}
const previousTrigger = {}
const nextTrigger = {}
let totalAmountNeededToNextTrigger = 0
let amountCollectedTowardsCurrentTrigger = 0
let amountLeftToCollectToCurrentTrigger = 0 
let currentProgress = 0

const intervalTimer = 5000 //60000 is 1 minute

var intervalLoop = setInterval(function(){
    Promise.all([getAmountFromShopify(),getAmountFromMusikhjalpen(),getTriggerList(),getOtherDonations()]).then((values) => {
        console.log("------------------------------------------------- Start -------------------------------------------------")

        let shopifyResult = values[0]
        amountShopify = shopifyResult
        console.log("Shopify fetched")
        console.log(amountShopify)

        let musikhjalpenResult = values[1]
        amountMusikhjalpen = musikhjalpenResult
        console.log("Musikhjalpen fetched")
        console.log(amountMusikhjalpen)

        let triggerListResult = values[2]
        triggerList = triggerListResult
        console.log("TriggerList fetched")
        console.log(triggerList)

        let otherDonationResult = values[3]
        let ammount = 0;
        for(let index in otherDonationResult) {
            ammount += parseInt(otherDonationResult[index])
        }
        totalDonations = ammount
        console.log("OtherDonations fetched")
        console.log(totalDonations)

        console.log("################################ FETCHING DONE ################################")

        totalAmountCollected = amountMusikhjalpen + amountShopify + totalDonations

        for(let i in triggerList) {
            let index = parseInt(i)
            let triggerPrice = triggerList[index][0]
            if (triggerPrice > totalAmountCollected ) {
                if (index == currentTriggerIndex) {
                    break
                }
                currentTrigger.TriggerPrice = triggerList[index][0]
                currentTrigger.TriggerTitle = triggerList[index][1]
                currentTrigger.TriggerDescription = triggerList[index][2]
                changeColorOfRow(index+2, colors.Green);
                currentTriggerIndex = index
                if(index > 0) {
                    previousTrigger.TriggerPrice = triggerList[index-1][0]
                    previousTrigger.TriggerTitle = triggerList[index-1][1]
                    previousTrigger.TriggerDescription = triggerList[index-1][2]
                    changeColorOfRow(index+1, colors.Red);
                }
                else {
                    previousTrigger.TriggerPrice = 0
                    previousTrigger.TriggerTitle = "Lets get this party started!"
                    previousTrigger.TriggerDescription = "No previous triggers"
                }
                if(index < triggerList.length-1) {
                    nextTrigger.TriggerPrice = triggerList[index+1][0]
                    nextTrigger.TriggerTitle = triggerList[index+1][1]
                    nextTrigger.TriggerDescription = triggerList[index+1][2]
                    changeColorOfRow(index+3, colors.Yellow);
                }
                else {
                    nextTrigger.TriggerPrice = 1000000
                    nextTrigger.TriggerTitle = "Amazing work!"
                    nextTrigger.TriggerDescription = "WOW! We have broken the goal for the fundraiser but why stop there, lets se how far we can go!"
                }
                break
            }else if(index == triggerList.length-1 && triggerPrice < totalAmountCollected){
                    previousTrigger.TriggerPrice = triggerList[index][0]
                    previousTrigger.TriggerTitle = triggerList[index][1]
                    previousTrigger.TriggerDescription = triggerList[index][2]
                    changeColorOfRow(index, colors.Red)

                    currentTrigger.TriggerPrice = 1000000
                    currentTrigger.TriggerTitle = "Amazing work!"
                    currentTrigger.TriggerDescription = "WOW! We have broken the goal for the fundraiser but why stop there, lets se how far we can go!"

                    nextTrigger.TriggerPrice = 0
                    nextTrigger.TriggerTitle = ""
                    nextTrigger.TriggerDescription = ""
            }
        }

        totalAmountNeededToNextTrigger = currentTrigger.TriggerPrice - previousTrigger.TriggerPrice
        amountCollectedTowardsCurrentTrigger = totalAmountCollected - previousTrigger.TriggerPrice
        amountLeftToCollectToCurrentTrigger = totalAmountNeededToNextTrigger - amountCollectedTowardsCurrentTrigger 
        currentProgress = amountCollectedTowardsCurrentTrigger / totalAmountNeededToNextTrigger
        
        console.log("------------------------------------------------- END -------------------------------------------------")
    });
  }, intervalTimer);

const app = express();
const PORT = parseInt(process.env.PORT) || 8080;
app.use(cors({
    origin: 'https://radiokbryrsig.se'
}))


app.get('/', (request, response) => {

    var res = {
        "TotalAmountCollected": totalAmountCollected,
        "previousTrigger": previousTrigger,
        "currentTrigger": currentTrigger,
        "nextTrigger": nextTrigger,
        "totalAmountNeededToNextTrigger": totalAmountNeededToNextTrigger,
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