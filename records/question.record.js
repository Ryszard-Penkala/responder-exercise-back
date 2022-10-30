const { pool } = require('../utils/db')
const { ValidationError } = require('../utils/errors')
const {v4: uuid} = require('uuid');

class QuestionRecord {
  constructor(obj) {
    console.log(obj)

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

    const [results] = await pool.execute("SELECT * FROM `question`");
    return  results;
  }

  async insertQuestion() {
    if(!this.id){
      this.id = uuid();
    }

    await pool.execute("INSERT INTO `question` VALUES(:id, :author, :summary)", {
      id: this.id,
      author: this.author,
      summary: this.summary,
    });

    return this.id
  }





}

module.exports = {
  QuestionRecord,
}