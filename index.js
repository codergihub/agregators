
if (process.env.HEROKU === 'YES') {
    const { initServer } = require('./server/server')
    initServer()
}