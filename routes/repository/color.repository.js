import mysql from 'promise-mysql';
import dbconfig from '../../config/database.json';
// 주석 ---
let connection = mysql.createPool(dbconfig);

export class ColorRepository {
  constructor() {}

  async getColor() {
    return await connection.query('select id as code, color, date from color_table order by code');
  }

  async getColorById(id) {
    return await connection.query('select id as code, color from color_table where id = '+id+' order by code');
  }

  async addColor(color) {
    return await connection.query('INSERT INTO `color_table`(`color`) VALUES ("' + color + '")').catch(e => e);
  }
}