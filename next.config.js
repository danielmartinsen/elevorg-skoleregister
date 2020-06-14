const dotenv = require('dotenv')
dotenv.config()

module.exports = {
  env: {
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: 'martinsendev-eo.firebaseapp.com',
    FIREBASE_DATABASE_URL: 'https://martinsendev-eo.firebaseio.com',
    FIREBASE_PROJECT_ID: 'martinsendev-eo',
    FIREBASE__STORAGE_BUCKET: 'martinsendev-eo.appspot.com',
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
  },
}
