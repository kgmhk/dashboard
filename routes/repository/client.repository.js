import mysql from 'promise-mysql';
import dbconfig from '../../config/database.json';
// 주석 ---
let connection = mysql.createPool(dbconfig);

export class ClientRepository {
  constructor() {}

  async getClient() {
    return await connection.query('select id as code, client_name as client, date from client_table order by code');
  }

  async getClientById(id) {
    return await connection.query('select id as code, client_name as client from client_table where id = '+id+' order by code');
  }

  async addClient(client) {
    return await connection.query('INSERT INTO `client_table`(`client_name`) VALUES ("' + client + '")').catch(e => e);
  }
}