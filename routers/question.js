const { Router } = require('express')
const { QuestionRecord } = require('../records/question.record')
const { AnswerRecord } = require('../records/answer.record')

const questionRouter = Router();

questionRouter
  .get('/', async (req, res) => {
    const allQuestionsWithAnswers = await QuestionRecord.getAllQuestionsAndAnswers()
    res.json(allQuestionsWithAnswers);
  })

  .get('/:questionId', async (req, res)=> {
    const questionWithId = await QuestionRecord.getQuestionById(req.params.questionId);
    res.json(questionWithId);
  })

  .post('/', async (req, res) => {
    const data = req.body;
    const newQuestion = new QuestionRecord(data);
    const questionId = await newQuestion.addQuestion();
    res.json(questionId);
  })

  .get('/:questionId/answers', async (req, res) => {
    const answers = await AnswerRecord.getAnswers(req.params.questionId);
    res.json(answers);
  })

  .post('/:questionId/answers',async (req, res) => {
    const data = req.body;
    const newAnswer = new AnswerRecord(data);
    const answerId = await newAnswer.addAnswer(req.params.questionId);
    res.json(answerId);

  })

  .get('/:questionId/answers/:answerId', async (req, res) => {
    const answer = await AnswerRecord.getAnswer(req.params.questionId, req.params.answerId);
    res.json(answer);
  } )


module.exports = {
  questionRouter,
}