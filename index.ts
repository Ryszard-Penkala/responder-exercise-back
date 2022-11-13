import express from 'express'
import 'express-async-errors';
import { json, urlencoded } from 'body-parser'
import cors from 'cors'
import './utils/db';

const { handleError } = require('./utils/errors')
const { homeRouter } = require('./routers/home')
const { questionRouter } = require('./routers/question')


const PORT = 3001

const app = express()

app.use(cors({origin: 'http://localhost:3000'}));
app.use(urlencoded({ extended: true }))
app.use(json())

app.use('/api/', homeRouter);
app.use('/api/questions', questionRouter)

app.use(handleError);

app.listen(PORT, '0.0.0.0',() => {
  console.log(`Responder app listening on port http://localhost:${PORT}`)
})
