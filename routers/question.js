const { Router } = require('express')

const questionRouter = Router();

questionRouter
  .get('/', async (req, res) => {
    const questions = await req.repositories.questionRepo.getQuestions()
    res.json(questions)
  })

  .get('/:questionId', async (req, res)=> {
    const questionWithId = await req.repositories.questionRepo.getQuestionById(req.params.questionId);
    res.json(questionWithId);
  })

  .post('/', (req, res) => {})

  .get('/:questionId/answers', (req, res) => {})

  .post('/:questionId/answers',(req, res) => {})

  .get(':questionId/answers/:answerId', (req, res) => {} )


module.exports = {
  questionRouter,
}