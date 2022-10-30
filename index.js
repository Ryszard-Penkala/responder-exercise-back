const express = require('express')
const { urlencoded, json } = require('body-parser')
const makeRepositories = require('./middleware/repositories')
const { handleError, ValidationError } = require('./utils/errors')
const { homeRouter } = require('./routers/home')
const { questionRouter } = require('./routers/question')

const STORAGE_FILE_PATH = 'questions.json'
const PORT = 3000

const app = express()

app.use(urlencoded({ extended: true }))
app.use(json())
app.use(makeRepositories(STORAGE_FILE_PATH))

app.use('/', homeRouter);
app.use('/questions', questionRouter)

app.use(handleError);

app.listen(PORT, () => {
  console.log(`Responder app listening on port ${PORT}`)
})
