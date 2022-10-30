const { Router } = require('express')
const { QuestionRecord } = require('../records/question.record')

const questionRouter = Router();

questionRouter
  .get('/', async (req, res) => {
    const allQuestions = await QuestionRecord.getAllQuestions()
    res.json(allQuestions);
    // const questions = await req.repositories.questionRepo.getQuestions()
    // res.json(questions)
  })

  .get('/:questionId', async (req, res)=> {
    const questionWithId = await req.repositories.questionRepo.getQuestionById(req.params.questionId);
    res.json(questionWithId);
  })

  .post('/', async (req, res) => {
    const data = req.body
    const newQuestion = new QuestionRecord(data)
    const questionId = await newQuestion.insertQuestion();
    res.json(questionId);
  })

  .get('/:questionId/answers', (req, res) => {})

  .post('/:questionId/answers',(req, res) => {})

  .get(':questionId/answers/:answerId', (req, res) => {} )


module.exports = {
  questionRouter,
}