import "@shopify/shopify-api/adapters/node";
import { shopifyApi, LATEST_API_VERSION, Session } from '@shopify/shopify-api'
import { restResources } from '@shopify/shopify-api/rest/admin/2023-10'

import 'dotenv/config';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET_KEY,
  apiVersion: LATEST_API_VERSION,
  isPrivateApp: true,
  scopes: [
    'read_analytics',
    'write_orders',
    'read_orders',
    'write_product_listings',
    'read_product_listings',
    'write_products',
    'read_products'
  ],
  isEmbeddedApp: false,
  hostName: "jstudent.myshopify.com",
  // Mount REST resources.
  restResources,
})

// Create a sanitized "fake" sessionId. E.g.
// "offline_my.myshopify.com".
const sessionId = shopify.session.getOfflineId('jstudent.myshopify.com')
const session = new Session({
  id: sessionId,
  shop: 'jstudent.myshopify.com',
  state: 'state',
  isOnline: false,
  accessToken: process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN,
})

export { shopify, session }