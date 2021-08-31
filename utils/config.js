require('dotenv').config()

const port= process.env.PORT || 3031
let dbUrl= process.env.DB_URL
const tokenSecret = process.env.TOKEN_SECRET
const env = process.env.NODE_ENV

if (env === 'test') {
  dbUrl= process.env.TEST_DB_URL
}

module.exports = {
  port , dbUrl , tokenSecret, env
}