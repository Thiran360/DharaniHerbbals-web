import Client from 'shopify-buy';

const domain = import.meta.env.VITE_SHOPIFY_DOMAIN || 'YOUR_STORE_NAME_HERE.myshopify.com';
const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || 'YOUR_STOREFRONT_ACCESS_TOKEN_HERE';

// Check if keys are placeholders
export const isShopifyConfigured = 
  domain !== 'YOUR_STORE_NAME_HERE.myshopify.com' && 
  storefrontAccessToken !== 'YOUR_STOREFRONT_ACCESS_TOKEN_HERE';

export const shopifyClient = Client.buildClient({
  domain: domain,
  storefrontAccessToken: storefrontAccessToken,
  apiVersion: '2024-01'
});
