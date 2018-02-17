import mysql from 'promise-mysql';
import dbconfig from '../../config/database.json';
// 주석 ---
let connection = mysql.createPool(dbconfig);

export class AccountRepository {
  constructor() {}

  async getAccount(id, pw) {
    const rows = await connection.query(`SELECT * FROM account_table WHERE account_id = "${id}" AND account_pw = "${pw}"`)
      .catch(e => {
        throw e
      });
    return rows;
  }
}