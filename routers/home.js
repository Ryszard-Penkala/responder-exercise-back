const { Router } = require('express')

const homeRouter = Router();

homeRouter
  .get('/', (req, res) => {
  res.json({ message: 'Welcome to responder!' })
})


module.exports = {
  homeRouter,
}