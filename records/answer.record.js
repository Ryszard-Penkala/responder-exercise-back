const { pool } = require('../utils/db')
const { ValidationError } = require('../utils/errors')
const {v4: uuid} = require('uuid');

class AnswerRecord {

  constructor(obj) {

    if (!obj.author || obj.author.length > 100 || obj.author.length < 1) {
      throw new ValidationError('Author name has to be not-empty string between 1 and 100 chars long.')
    }

    if (!obj.summary || obj.summary.length <= 2 || obj.summary.length > 300) {
      throw new ValidationError('Summary has to be not-empty string between 3 and 300 chars long.')
    }

    this.id = obj.id;
    this.author = obj.author;
    this.summary = obj.summary;

  }

  static async getAnswers(questionId){
    try {
      const [results] = await pool.execute("SELECT `id`, `author`, `summary` FROM `answer` WHERE `questionId`=:id", {
        id: questionId,
      });
      return results.length === 0 ? null : results.map(obj => new AnswerRecord(obj));
    } catch (e) {
      console.log(e);
    }
  }

  static async getAnswer(questionId, answerId){
    try{
      const [result] = await pool.execute("SELECT `id`, `author`, `summary` FROM `answer` WHERE `questionId`=:questionId AND `id`=:answerId", {
        questionId,
        answerId,
      });
      return  result.length === 0 ? null : new AnswerRecord(result[0]);
    } catch (e) {
      console.log(e);
    }
  }

  async addAnswer(questionId){
    if(!this.id){
      this.id = uuid();
    }

    try {
      await pool.execute("INSERT INTO `answer` VALUES(:id, :author, :summary, :questionId)", {
        id: this.id,
        author: this.author,
        summary: this.summary,
        questionId: questionId,
      });

      return this.id
    } catch (e) {
      console.log(e);
    }
  }

  static async removeAnswers(questionId) {
    try{
      await pool.execute("DELETE FROM `answer` WHERE `answer`.`questionId` =:id", {
        id: questionId,
      });
      return questionId;
    } catch (e) {
      console.log(e);
    }
  }

  static async removeAnswerById(answerId) {
    try{
      await pool.execute("DELETE FROM `answer` WHERE `answer`.`id` =:id", {
        id: answerId,
      })
      return answerId;
    } catch (e) {
      console.log(e);
    }
  }

  async update() {

    await pool.execute("UPDATE `answer` SET `author`=:author, `summary`=:summary WHERE `answer`.`id`=:id", {
      id: this.id,
      author: this.author,
      summary: this.summary,
    });

    return this.id;
  }
}

module.exports = {
  AnswerRecord,
}