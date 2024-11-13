import { shopify, session } from './restClient.js';

async function setProductPending(productId, tags) {
    const product = new shopify.rest.Product({session: session});
    product.id = productId;
    const tagsArray = tags.split(", ");
    tagsArray.push("pending");
    tags = tagsArray.filter(tag => tag !== "running").join(", ");
    product.tags = tags;
    await product.save({
        update: true,
    });
}

async function setProductRunning(productId, tags) {
    const product = new shopify.rest.Product({session: session});
    product.id = productId;
    const tagsArray = tags.split(", ");
    tagsArray.push("running");
    tags = tagsArray.filter(tag => tag !== "pending").join(", ");
    product.tags = tags;
    await product.save({
        update: true,
    });
}

async function setCollectionRunning(collectionId) {
    await shopify.rest.Collection.products({
        session: session,
        id: collectionId,
        limit: 250,
    }).then(async (products) => {
        for (let index in products.products) {
            setTimeout(async () => {
                await setProductRunning(products.products[index].id, products.products[index].tags)
            }, 1600*index)
        }
    });
}

async function setCollectionPending(collectionId) {
    await shopify.rest.Collection.products({
        session: session,
        id: collectionId,
        limit: 250,
    }).then(async (products) => {
        for (let index in products.products) {
            setTimeout(async () => {
                await setProductPending(products.products[index].id, products.products[index].tags)
            }, 1600*index)
        }
    });
}

async function getAllCollections() {
    const collections = await shopify.rest.SmartCollection.all({
        session: session,
        fields: "id,title",
    })

    return collections.data
}

export {setCollectionRunning, setCollectionPending, getAllCollections}