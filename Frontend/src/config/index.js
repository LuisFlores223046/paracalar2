export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  appName: import.meta.env.VITE_APP_NAME || 'BeFit',
  appUrl: import.meta.env.VITE_APP_URL || 'http://localhost:3000',

  cognito: {
    region: import.meta.env.VITE_COGNITO_REGION,
    userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
    clientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
  },

  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  },

  paypal: {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
  },
}

export default config
