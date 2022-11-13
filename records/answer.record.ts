import { pool } from '../utils/db'
import { ValidationError } from '../utils/errors'
import { v4 as uuid } from 'uuid'
import { FieldPacket } from 'mysql2'

type AnswerRecordResults= [AnswerRecord[], FieldPacket[]]

export class AnswerRecord {
  public id?: string;
  public author: string;
  public summary: string;
  public questionId: string;
  constructor(obj: AnswerRecord) {

    if (!obj.author || obj.author.length > 100 || obj.author.length < 1) {
      throw new ValidationError('Author name has to be not-empty string between 1 and 100 chars long.')
    }

    if (!obj.summary || obj.summary.length <= 2 || obj.summary.length > 300) {
      throw new ValidationError('Summary has to be not-empty string between 3 and 300 chars long.')
    }

    this.id = obj.id;
    this.author = obj.author;
    this.summary = obj.summary;
    this.questionId = obj.questionId;

  }

  static async getAnswers(questionId: string):  Promise<AnswerRecord[] | null>{
    try {
      const [results] = await pool.execute("SELECT `id`, `author`, `summary` FROM `answer` WHERE `questionId`=:id", {
        id: questionId,
      }) as AnswerRecordResults;
      return results.length === 0 ? null : results.map(obj => new AnswerRecord(obj));
    } catch (e) {
      console.log(e);
    }
  }

  static async getAnswer(questionId: string, answerId: string): Promise<AnswerRecord | null>{
    try{
      const [result] = await pool.execute("SELECT `id`, `author`, `summary` FROM `answer` WHERE `questionId`=:questionId AND `id`=:answerId", {
        questionId,
        answerId,
      }) as AnswerRecordResults;
      return  result.length === 0 ? null : new AnswerRecord(result[0]);
    } catch (e) {
      console.log(e);
    }
  }

  async addAnswer(questionId: string): Promise<string>{
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

  static async removeAnswers(questionId: string): Promise<string> {
    try{
      await pool.execute("DELETE FROM `answer` WHERE `answer`.`questionId` =:id", {
        id: questionId,
      });
      return questionId;
    } catch (e) {
      console.log(e);
    }
  }

  static async removeAnswerById(answerId: string): Promise<string> {
    try{
      await pool.execute("DELETE FROM `answer` WHERE `answer`.`id` =:id", {
        id: answerId,
      })
      return answerId;
    } catch (e) {
      console.log(e);
    }
  }

  async update(): Promise<string> {

    await pool.execute("UPDATE `answer` SET `author`=:author, `summary`=:summary WHERE `answer`.`id`=:id", {
      id: this.id,
      author: this.author,
      summary: this.summary,
    });

    return this.id;
  }
}