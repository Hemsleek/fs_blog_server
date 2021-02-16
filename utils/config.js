require('dotenv').config()

const port= process.env.PORT
const dbUrl= process.env.DB_URL || 3031

module.exports = {
    port , dbUrl
}