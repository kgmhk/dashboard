import mysql from 'promise-mysql';
import dbconfig from '../../config/database.json';
// 주석 ---
let connection = mysql.createPool(dbconfig);

export class BrandRepository {
  constructor() {}

  async getBrand() {
    return await connection.query('select id as code, brand_name as brand, date from brand_table order by code');
  }

  async getBrandById(id) {
    return await connection.query('select id as code, brand_name as brand from brand_table where id = '+id+' order by code');
  }

  async addBrand(brand) {
    return await connection.query('INSERT INTO `brand_table`(`brand_name`) VALUES ("' + brand + '")').catch(e => e);
  }
}