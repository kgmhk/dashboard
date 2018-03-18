import mysql from 'promise-mysql';
import dbconfig from '../../config/database.json';
// 주석 ---
let connection = mysql.createPool(dbconfig);

export class ProductsRepository {
  constructor() {
    console.log(`ProductsRepository constructor()`);

  }

  async deleteProductById(id) {
    return await connection.query('delete from shoes_table where id = "' +id + '"')
  }

  async getProducts() {
    // const rows = await connection.query("SELECT *, count(size) as count FROM shoes_table as shoes join brand_table as brand " +
    //   "WHERE shoes.code = brand.code Group by shoes.size, shoes.code order by brand.id");
    // const rows = await connection.query("SELECT *, count(size) as count FROM (SELECT shoes_table.* FROM shoes_table LEFT JOIN sold_table ON shoes_table.id = sold_table.shoes_id where sold_table.id IS NULL) as sold_shoes join brand_table as brand WHERE sold_shoes.code = brand.code Group by sold_shoes.size, sold_shoes.code order by brand.id");
    const rows = await connection.query("SELECT *, count(size) as count, sold_shoes.id as shoe_id FROM (SELECT shoes_table.* FROM shoes_table LEFT JOIN sold_table ON shoes_table.id = sold_table.shoes_id where sold_table.id IS NULL) as sold_shoes join brand_table as brand WHERE sold_shoes.brand = brand.id Group by sold_shoes.size, sold_shoes.code order by brand.id");
    return rows;
  }

  async getAllProducts() {
    const rows = await connection.query("SELECT shoes.* FROM shoes_table as shoes LEFT JOIN sold_table ON shoes.id = sold_table.shoes_id where sold_table.id IS NULL");
    return rows;
  }

  async insertColor(color) {
    return await connection.query('INSERT INTO `color_table`(`color`) VALUES ("'+color+'")').catch(err => {
      console.log(err);
      if (err.errno !== 1062) throw err;
    });
  }

  async insertBrand(brand) {
    return await connection.query('INSERT INTO `brand_table`(`brand_name`) VALUES ("'+brand+'")').catch(err => {
      console.log(err);
      if (err.errno !== 1062) throw err;
    });
  }

  async insertShoes(code, brand, design, size, inputPrice, outputPrice, color, client) {
    return await connection.query('INSERT INTO `shoes_table`(`code`, `brand`, `design`, `size`, `input_price`, `output_price`, `color`, `client`) VALUES ("'+code+'", "'+brand+'" ,"'+design+'" ,"'+size+'", "'+inputPrice+'", "'+outputPrice+'", "'+color+'", "'+client+'")')
      .catch(err => err);
  }

  async getProductExceptSoldProduct(code, color, size) {
    return await connection.query('SELECT shoes.* FROM shoes_table as shoes LEFT JOIN sold_table ON shoes.id = sold_table.shoes_id where sold_table.id IS NULL and shoes.size = '+ size +' and shoes.color = "'+ color +'" limit 0, 1')
      .catch(err => {
        console.log('err : ', err);
        throw err;
    })
  }

  async insertSoldProduct(shoes_id) {
    await connection.query('INSERT INTO `sold_table`(`shoes_id`) VALUES ("'+shoes_id+'")').catch(err => {
      console.log(err);
      throw err;
    });
  }

  async getSoldProducts() {
    return await connection.query('SELECT a.id, a.code, a.size, a.input_price as inputPrice, a.output_price as outputPrice, a.brand_name as brand, a.client, a.color, b.date FROM (select shoes_table.*, brand_table.brand_name FROM shoes_table LEFT JOIN brand_table ON shoes_table.brand = brand_table.id) as a RIGHT JOIN sold_table as b on a.id = b.shoes_id')
      .catch(e => {
        console.log('getSoldProducts err: ', e);
        throw e;
      })
  }
}