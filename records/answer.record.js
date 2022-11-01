const { pool } = require('../utils/db')
const { ValidationError } = require('../utils/errors')
const {v4: uuid} = require('uuid');

class AnswerRecord {

  constructor(obj) {

    if (!obj.author || obj.author.length > 100 || obj.author.length < 1) {
      throw new ValidationError('Author name has to be not-empty string between 1 and 100 chars long.')
    }

    if (!obj.summary || obj.summary.length <= 5 || obj.summary.length > 300) {
      throw new ValidationError('Summary has to be not-empty string between 1 and 300 chars long.')
    }

    this.id = obj.id;
    this.author = obj.author;
    this.summary = obj.summary;

  }

  static async getAnswers(questionId){
    const [results] = await pool.execute("SELECT `id`, `author`, `summary` FROM `answer` WHERE `questionId`=:id", {
      id: questionId,
    });
    return results;
  }



}

module.exports = {
  AnswerRecord,
}