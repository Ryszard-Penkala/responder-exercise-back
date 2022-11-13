const { readFile, writeFile, appendFile } = require('fs/promises')


const makeQuestionRepository = fileName => {
  const getQuestions = async () => {
    try{
      const fileContent = await readFile(fileName, { encoding: 'utf-8' });
      const questions = JSON.parse(fileContent);

      return questions;

    } catch (e) {

      throw new Error(e);
    }

  }



  const getQuestionById = async questionId => {
    try {
      const fileContentParsed = JSON.parse(await readFile(fileName, {encoding: 'utf-8'}));

      const questionById = fileContentParsed.filter(question => question.id === questionId);

      return questionById;

    } catch (e){
      throw new Error(e)
    }
  }
  const addQuestion = async question => {}
  const getAnswers = async questionId => {}
  const getAnswer = async (questionId, answerId) => {}
  const addAnswer = async (questionId, answer) => {}

  return {
    getQuestions,
    getQuestionById,
    addQuestion,
    getAnswers,
    getAnswer,
    addAnswer
  }
}

module.exports = { makeQuestionRepository }
