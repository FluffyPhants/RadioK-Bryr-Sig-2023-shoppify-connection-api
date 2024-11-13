//Airtable
import getAuctions from "./Airtable/getAuctions.js";

//shopify
import {setCollectionRunning, setCollectionPending, getAllCollections} from './shopify/collections.js'

//DATA TABLE
var auctions = []

//FETCH AUCTION INFORMATION
const fetchAuctions = async () => {
    const auctionTimes = await getAuctions()
    const auctionCollections = await getAllCollections()

    auctions = auctionTimes.map((auction) => {
        const collection = auctionCollections.find(collection => collection.title == auction.tag)
        const currentAuction = auctions.find(a => a.tag == auction.tag)
        const currentAuctionStatus = currentAuction ? currentAuction.status : "None"
        return {
            ...auction,
            ...collection,
            status: currentAuctionStatus
        }
    })
}

//CHECK IF AUCTION SHOULD BE RUNNING
const checkAuction = async () => {
    const now = new Date()

    auctions.forEach(async (auction) => {
        const auctionDate = new Date(auction.time)
        if(now > auctionDate) {
            if(auction.status != "running") {
                console.log("Auction should be running", auction.tag)
                setCollectionRunning(auction.id)
                auction.status = "running"
            }
        } else {
            if(auction.status != "pending") {
                console.log("Auction should not be running", auction.tag)
                setCollectionPending(auction.id)
                auction.status = "pending"
            }
        }
    })
}

function auctionHandler() {
    fetchAuctions().then(() => {
        checkAuction()
    })
}

export default auctionHandler;