import axios from "axios";
import {shopifyApi, LATEST_API_VERSION} from "@shopify/shopify-api";
import "@shopify/shopify-api/adapters/node";
import { json } from "express";

const shopify = shopifyApi({
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecretKey: process.env.SHOPIFY_API_SECRET,
    scopes: process.env.SCOPES,
    hostName: "ngrok-tunnel-address"
});

//update to take in from date param
async function shopifyGetAllPaidOrders() {
    const axiosResponse = await axios.request({
        method: "GET",
        url: "https://jstudent.myshopify.com/admin/api/2023-10/orders.json?fields=financial_status,name,total_price,total_tip_received&limit=250&status=any&created_at_min=2023-11-24T07:42:11+01:00",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
            "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN
        }
    }).catch(function (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
        console.log(error.config);
        return []
        });
        console.log(axiosResponse.data)
    return axiosResponse.data.orders
}


function calculateValueOfOrders(orders) {
    let sum = 0
    for(let order in orders) {
        let price = parseFloat(orders[order].total_price)
        let donation = parseFloat(orders[order].total_tip_received)
        if(price != NaN)
            sum += price + donation
        else 
            console.log("Error: Could not parse price of order " + orders[order].name)
    }
    return sum
}


//returns the ammount of money collected through shopify
async function getAmountFromShopify() {

    const shopifyOrders = await shopifyGetAllPaidOrders()

    try {
        const value = calculateValueOfOrders(shopifyOrders)
        return value;
    }
    catch (error) {
        console.log(error);
    }
}

export {getAmountFromShopify};