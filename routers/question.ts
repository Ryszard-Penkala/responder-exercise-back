import { Router } from 'express'
import { QuestionRecord } from '../records/question.record'
import { AnswerRecord } from '../records/answer.record'
import { ValidationError } from '../utils/errors'

export const questionRouter = Router();

questionRouter
  .get('/', async (req, res) => {
    const allQuestionsWithAnswers = await QuestionRecord.getAllQuestionsAndAnswers()
    res.json(allQuestionsWithAnswers);
  })

  .get('/:questionId', async (req, res)=> {
    const questionWithId = await QuestionRecord.getQuestionByIdWithAnswers(req.params.questionId);
    res.json(questionWithId);
  })

  .post('/', async (req, res) => {
    const data = req.body;
    const newQuestion = new QuestionRecord(data);
    const questionId = await newQuestion.addQuestion();
    res.json(questionId);
  })

  .patch('/:questionId', async (req, res)=>{
    const {body} = req
    const question = await QuestionRecord.getQuestionByIdWithoutAnswers(req.params.questionId);

    if(question === null) {
      throw new ValidationError("Haven't found question with given ID.");
    }

    if (body.author === null || body.summary === null) {
      throw new ValidationError("Author and summary have to be provided.")
    }

    question.author = body.author;
    question.summary = body.summary;
    await question.update();

    res.json(question);


  })

  .delete('/:questionId', async (req, res) => {
    const deletedQuestionId = await QuestionRecord.removeQuestion(req.params.questionId);
    res.json(deletedQuestionId);
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

  .delete('/:questionId/answers', async (req, res)=>{
    const deletedAnswerId = await AnswerRecord.removeAnswers(req.params.questionId);
    res.json(deletedAnswerId);
  })

  .get('/:questionId/answers/:answerId', async (req, res) => {
    const answer = await AnswerRecord.getAnswer(req.params.questionId, req.params.answerId);
    res.json(answer);
  })

  .patch('/:questionId/answers/:answerId', async (req, res)=> {
    const {body} = req
    const answer = await AnswerRecord.getAnswer(req.params.questionId, req.params.answerId)

    if(answer === null) {
      throw new ValidationError("Haven't found answer with given ID.");
    }

    if (body.author === null || body.summary === null) {
      throw new ValidationError("Author and summary have to be provided.")
    }

    answer.author = body.author;
    answer.summary = body.summary;
    await answer.update();

    res.json(answer);
  })

  .delete('/:questionId/answers/:answerId', async (req, res)=> {
    const answer = await AnswerRecord.removeAnswerById(req.params.answerId);
    res.json(answer);
  })
