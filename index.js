const express = require('express')
const { urlencoded, json } = require('body-parser')
const cors = require('cors');
require('express-async-errors');
require('./utils/db');

const makeRepositories = require('./middleware/repositories')
const { handleError } = require('./utils/errors')
const { homeRouter } = require('./routers/home')
const { questionRouter } = require('./routers/question')


const STORAGE_FILE_PATH = 'questions.json'
const PORT = 3001

const app = express()

app.use(cors({origin: 'http://localhost:3000'}));
app.use(urlencoded({ extended: true }))
app.use(json())
app.use(makeRepositories(STORAGE_FILE_PATH))

app.use('/', homeRouter);
app.use('/questions', questionRouter)

app.use(handleError);

app.listen(PORT, '0.0.0.0',() => {
  console.log(`Responder app listening on port http://localhost:${PORT}`)
})
