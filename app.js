const config = require('./utils/config')
const express = require('express')
const app = express()
const helmet = require('helmet')
const cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')
const router = require('./controllers/blogs')
const logger = require('./utils/logger')

app.use(helmet())
const mongoUrl = config.dbUrl
const mongoConfig = {
  useUnifiedTopology:true,
  useNewUrlParser:true,
  useCreateIndex:true,
  useFindAndModify: false
}

mongoose.connect(mongoUrl,mongoConfig)

const db = mongoose.connection
db.once('open', () => { logger.info('db connection sucessful')})
db.on('error',logger.info)

app.use(cors())
app.use(express.json())
morgan.token('body' , (req) => JSON.stringify(req.body))

if(process.env.NODE_ENV !== 'test') app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use('/api/blogs', router)

module.exports = app
