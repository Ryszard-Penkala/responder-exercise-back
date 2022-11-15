import { FieldPacket } from 'mysql2'
import { pool } from '../utils/db'
import { ValidationError } from '../utils/errors'
import { v4 as uuid } from 'uuid'
import { AnswerRecord } from './answer.record'

type QuestionRecordResults= [QuestionRecord[], FieldPacket[]]


export class QuestionRecord {
  public id: string;
  public author: string;
  public summary: string;
  public answers: AnswerRecord[] | [] | null | any;

  constructor(obj: QuestionRecord) {

    if (!obj.summary || obj.summary.length <= 2 || obj.summary.length > 300) {
      throw new ValidationError('Summary has to be not-empty string between 3 and 300 chars long.')
    }

    if (!obj.author || obj.author.length > 100 || obj.author.length < 1) {
      throw new ValidationError('Author name has to be not-empty string between 1 and 100 chars long.')
    }

    this.id = obj.id;
    this.author = obj.author;
    this.summary = obj.summary;
    this.answers = obj.answers;

  }

  static async getAllQuestions(): Promise<QuestionRecord[] | null>{

    try{
      const [results] = await pool.execute("SELECT * FROM `question`") as QuestionRecordResults;
      return  results.length === 0 ? null : results.map(obj => new QuestionRecord(obj));
    } catch (e) {
      console.log(e);
    }
  }

  static async getAllQuestionsAndAnswers(): Promise<QuestionRecord[] | null> {

    try{
      const [results] = await pool.execute("SELECT `question`.*, JSON_ARRAY(GROUP_CONCAT(JSON_OBJECT('id', `answer`.`id`, 'author', `answer`.`author`, 'summary', `answer`.`summary`))) AS 'answers' FROM `question` LEFT OUTER JOIN `answer` ON `question`.`id` = `answer`.`questionId` GROUP BY `question`.`id`") as QuestionRecordResults;
      const outputArr: QuestionRecord[] | [] | any = []
      results.forEach(result => {
        const questionObj: any = {
          ...result,
          // "answers": JSON.parse(JSON.parse(result.answers)[0]).id === null ? [] : (JSON.parse(result.answers)).map( res => JSON.parse(res)), //@TODO zrobić tak by działało
          answers: JSON.parse(result.answers)[0] === null ? [] : JSON.parse(result.answers),
        };
        outputArr.push(questionObj)
      })
      return outputArr;
    } catch (e) {
      console.log(e);
    }
  }

  static async getQuestionByIdWithAnswers(questionId: string): Promise<QuestionRecord[] | null | any> {
    try{
      const [results] = await pool.execute("SELECT `question`.*, JSON_ARRAY(GROUP_CONCAT(JSON_OBJECT('id', `answer`.`id`, 'author', `answer`.`author`, 'summary', `answer`.`summary`)) AS 'answers' FROM `question` LEFT OUTER JOIN `answer` ON `question`.`id` = `answer`.`questionId` WHERE `question`.`id` = :id GROUP BY `question`.`id`", {
        id: questionId,
      }) as QuestionRecordResults;
      if (results.length === 0) {
        return null;
      }
      return { ...results[0],
        answers: JSON.parse(results[0].answers)[0].id === null ? [] : JSON.parse(results[0].answers)}
    } catch (e) {
      console.log(e);
    }
  }

  static async getQuestionByIdWithoutAnswers(questionId: string): Promise<QuestionRecord | null> {
    try {
      const [results] = await pool.execute("SELECT * FROM `question` WHERE `question`.`id` =:id", {
        id: questionId,
      }) as QuestionRecordResults;
      return  results.length === 0 ? null : new QuestionRecord(results[0]);
    } catch (e) {
      console.log(e);
    }
  }

  async addQuestion(): Promise<string> {
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

  async update(): Promise<string> {

    await pool.execute("UPDATE `question` SET `author`=:author, `summary`=:summary WHERE `question`.`id`=:id", {
      id: this.id,
      author: this.author,
      summary: this.summary,
    });

    return this.id;
  }

  static async removeQuestion(questionId: string): Promise<string> {
    try{
      await pool.execute("DELETE FROM `answer` WHERE `answer`.`questionId` = :id ", {
        id: questionId,
      });
      await pool.execute("DELETE FROM `question` WHERE `question`.`id` = :id ", {
        id: questionId,
      });
      return questionId;
    } catch (e) {
      console.log(e);
    }
  }

}