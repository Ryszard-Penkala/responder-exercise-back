const { pool } = require('../utils/db')
const { ValidationError } = require('../utils/errors')
const {v4: uuid} = require('uuid');

class QuestionRecord {
  constructor(obj) {

    if (!obj.summary || obj.summary.length <= 5 || obj.summary.length > 300) {
      throw new ValidationError('Summary has to be not-empty string between 1 and 300 chars long.')
    }

    if (!obj.author || obj.author.length > 100 || obj.author.length < 1) {
      throw new ValidationError('Author name has to be not-empty string between 1 and 100 chars long.')
    }

    this.id = obj.id;
    this.author = obj.author;
    this.summary = obj.summary;

  }

  static async getAllQuestions(){

    try{
      const [results] = await pool.execute("SELECT * FROM `question`");
      return  results;
    } catch (e) {
      console.log(e);
    }
  }

  static async getAllQuestionsAndAnswers(){

    try{
      const [results] = await pool.execute("SELECT `question`.*, JSON_ARRAYAGG(JSON_OBJECT('id', `answer`.`id`, 'author', `answer`.`author`, 'summary', `answer`.`summary`)) AS 'answers' FROM `question` LEFT JOIN `answer` ON `question`.`id` = `answer`.`questionId` GROUP BY `question`.`id`")
      const outputArr = []
      results.forEach(result => {
        const questionObj = {
          ...result,
          "answers": JSON.parse(result.answers)[0].id === null ? [] : JSON.parse(result.answers),
        };
        outputArr.push(questionObj)
      })
      return outputArr;
    } catch (e) {
      console.log(e);
    }
  }

  static async getQuestionById(questionId) {
    try{
      const [results] = await pool.execute("SELECT `question`.*, JSON_ARRAYAGG(JSON_OBJECT('id', `answer`.`id`, 'author', `answer`.`author`, 'summary', `answer`.`summary`)) AS 'answers' FROM `question` LEFT JOIN `answer` ON `question`.`id` = `answer`.`questionId` WHERE `question`.`id` = :id GROUP BY `question`.`id`", {
        id: questionId,
      })

      return { ...results[0],
        "answers": JSON.parse(results[0].answers)[0].id === null ? [] : JSON.parse(results[0].answers)}
    } catch (e) {
      console.log(e);
    }
  }

  async addQuestion() {
    try{
      if(!this.id){
        this.id = uuid();
      }

      await pool.execute("INSERT INTO `question` VALUES(:id, :author, :summary)", {
        id: this.id,
        author: this.author,
        summary: this.summary,
      });

      return this.id
    } catch (e) {
      console.log(e);
    }
  }

  static async removeQuestion(questionId) {
    try{
      await pool.execute("DELETE FROM `question` WHERE `question`.`id` = :id ", {
        id: questionId,
      })
      return questionId;
    } catch (e) {
      console.log(e);
    }
  }

}

module.exports = {
  QuestionRecord,
}