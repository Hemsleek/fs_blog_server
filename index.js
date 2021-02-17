const app = require('./app')
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)

server.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`)
  logger.info(`http://localhost:${config.port}`)

})