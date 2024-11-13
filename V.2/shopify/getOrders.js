import { shopify, session } from './restClient.js';

//date format: 2023-11-24T07:42:11
async function shopifyGetAllOrdersFromDate(date) {
    const orders = await shopify.rest.Order.all({
        session: session,
        status: "any",
        limit: 250,
        fields: ["financial_status","name","total_price","total_tip_received"],
        created_at_min: `${date}+01:00`,
    }).catch(function (error) {
        console.log(error)
        return []
    });
    
    //console.log(orders.data)
    return orders.data
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

    const fromDate = "2023-11-24T07:42:11"

    const shopifyOrders = await shopifyGetAllOrdersFromDate(fromDate)

    try {
        const value = calculateValueOfOrders(shopifyOrders)
        return value;
    }
    catch (error) {
        console.log(error);
    }
}

export default getAmountFromShopify;