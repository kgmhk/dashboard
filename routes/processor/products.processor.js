import _ from 'lodash';
import moment from 'moment';
import { ProductsRepository } from '../repository/products.repository';
import { ClientRepository } from '../repository/client.repository';
import { BrandRepository } from "../repository/brand.repository";
import { ColorRepository } from "../repository/color.repository";

let productsRepository;
let clientRepository;
let brandRepository;
let colorRepository;

export class ProductsProcessor {
  constructor() {
    console.log('ProductsProcessor constructor');
    productsRepository = new ProductsRepository();
    clientRepository = new ClientRepository();
    brandRepository = new BrandRepository();
    colorRepository = new ColorRepository();
  }

  errorMsg(flag, msg) {
    return {
      result : false,
      msg: msg
    }
  }

  async deleteProductById(id) {
    console.log('delete product id : ', id);
    return await productsRepository.delete
  }

  async getAllProducts() {
    console.log('get All Products');
    let allProducts = await productsRepository.getAllProducts();

    return allProducts;
  }

  async getProducts() {
    console.log('ProductsProcessor');
    let products = await productsRepository.getProducts();
    let clients = await clientRepository.getClient();
    let sizeArray = [130,140,150,160,170,180,190,200,210,220,225,230,235,240,245,250,255,260,265,270,275,280,285,290,295,300];

    let shoesInfo = {};
    sizeArray.forEach(size => {
      products.forEach(product => {
        if (shoesInfo[product.code]) {
          if (!shoesInfo[product.code][size] && product.size === size) {
            shoesInfo[product.code][size] = product.count;
          } else if (!shoesInfo[product.code][size]) {
            // shoesInfo[product.code][size] = 0;
          }
        } else {
          let client = _.find(clients, {client: product.client});
          console.log('client : ', client);
          shoesInfo[product.code] = {
            id: product.shoe_id,
            code: product.code,
            color: product.color,
            inputPrice: product.input_price,
            outputPrice: product.output_price,
            brand: product.brand_name,
            client: product.client,
            margin: client.margin
          };

          shoesInfo[product.code][product.size] = product.count

        }
      })
    });
    let data = _.map(shoesInfo, shoe => {
      return shoe;
    });

    return data;
  }

  async createProduct(code, color, inputPrice, outputPrice, brand, size, client) {

    console.log('createProducts');
    await productsRepository.insertColor(color);
    await productsRepository.insertBrand(brand);
    const result = await productsRepository.insertShoes(code, brand, size, inputPrice, outputPrice, color, client);


    if (result.errno && result.errno === 1062) {
      return this.errorMsg(true, '이미 등록된 재고 입니다.');
    } else if (result.errno) {
      console.log('result : ', result);
      return this.errorMsg(false, '등록에 실패하였습니다. 다시 한번 시도해주세요.');
    } else {
      return this.errorMsg(true, '정상적으로 등록 되었습니다.');
    }
  }

  async createProductByBarcode(barcode) {

    console.log('createProduct by barcode');

    const splitedBarcode = barcode.split('&');

    const code = splitedBarcode[0];
    const size = splitedBarcode[1];
    const inputPrice = splitedBarcode[2];
    const outputPrice = splitedBarcode[3];


    if (!code) {
      return this.errorMsg(false, '바코드에 코드 정보가 없습니다.');
    }
    if (!size) {
      return this.errorMsg(false, '바코드에 색상 정보가 없습니다.');
    }
    if (!inputPrice) {
      return this.errorMsg(false, '바코드에 입고가격 정보가 없습니다.');
    }
    if (!outputPrice) {
      return this.errorMsg(false, '바코드에 판매가격 정보가 없습니다.');
    }

    console.log(`code : ${code}, size: ${size}, inputPrice: ${inputPrice}, outputPrice: ${outputPrice}`);

    const clientCode = Number(code.substr(0, 2));
    const brandCode = Number(code.substr(2, 2));
    const designCode = Number(code.substr(4, 3));
    const colorCode = Number(code.substr(7, 2));

    console.log(`clientCode: ${clientCode}, brandCode: ${brandCode}, designCode: ${designCode}, colorCode: ${colorCode}`);

    const clientResult = await clientRepository.getClientById(clientCode);
    console.log('clientResult : ', clientResult);

    if (clientResult.length === 0) {
      return {
        result : false,
        msg: '거래처 정보가 존재하지 않습니다. 거래처 코드('+clientCode+')를 확인해주세요.'
      }
    }

    const client = clientResult[0].client;

    console.log(`client: ${client}`);

    const brandResult = await brandRepository.getBrandById(brandCode);
    console.log('brandResult : ', brandResult);

    if (brandResult.length === 0) {
      return {
        result : false,
        msg: '브랜드 정보가 존재하지 않습니다. 브랜드 코드('+brandCode+')를 확인해주세요.'
      }
    }

    const brand = brandCode;

    const colorResult = await colorRepository.getColorById(colorCode);

    console.log('colorResult : ', colorResult);

    if (colorResult.length === 0) {
      return {
        result : false,
        msg: '색상 정보가 존재하지 않습니다. 색상 코드('+colorCode+')를 확인해주세요.'
      }
    }

    const color = colorResult[0].color;

    // await productsRepository.insertColor(color);
    // await productsRepository.insertBrand(brand);
    const result = await productsRepository.insertShoes(code, brand, designCode, size, inputPrice, outputPrice, color, client);


    if (result.errno && result.errno === 1062) {
      return {
        result: true,
        msg: '이미 등록된 재고 입니다.'
      }
    } else if (result.errno) {
      console.log('result : ', result);
      return {
        result: false,
        msg: '등록에 실패하였습니다. 다시 한번 시도해주세요.'
      }
    } else {
      return {
        result: true,
        msg: '정상적으로 등록 되었습니다.'
      }
    }
  }

  async soldProductByBarCode(barcode) {
    console.log('Sold Product by barcode');

    const splitedBarcode = barcode.split('&');

    const code = splitedBarcode[0];
    const size = splitedBarcode[1];
    const inputPrice = splitedBarcode[2];
    const outputPrice = splitedBarcode[3];

    if (!code) {
      return this.errorMsg(false, '바코드에 코드 정보가 없습니다.');
    }
    if (!size) {
      return this.errorMsg(false, '바코드에 색상 정보가 없습니다.');
    }
    if (!inputPrice) {
      return this.errorMsg(false, '바코드에 입고가격 정보가 없습니다.');
    }
    if (!outputPrice) {
      return this.errorMsg(false, '바코드에 판매가격 정보가 없습니다.');
    }

    const clientCode = Number(code.substr(0, 2));
    const brandCode = Number(code.substr(2, 2));
    const colorCode = Number(code.substr(7, 2));

    console.log(`clientCode: ${clientCode}, brandCode: ${brandCode}, colorCode: ${colorCode}`);

    const colorResult = await colorRepository.getColorById(colorCode);

    console.log('colorResult : ', colorResult);

    if (colorResult.length === 0) {
      const msg = '색상 정보가 존재하지 않습니다. 색상 코드('+colorCode+')를 확인해주세요.';
      return this.errorMsg(false, msg);
    }

    const color = colorResult[0].color;

    const soldProductResult = await this.soldProduct(code, color, size);

    if (soldProductResult) {
      return this.errorMsg(true, `${code} 상품이 정상적으로 판매 물품에 등록되었습니다.`);
    } else {
      return this.errorMsg(false, `code: ${code}, size: ${size}, color: ${color}를 가진 재고 물품이 없습니다. 재고 상태를 확인해주세요.`);
    }

  }

  async soldProduct(code, color, size) {
    console.log('soldProduct');
    const data = await productsRepository.getProductExceptSoldProduct(code, color, size);

    if (data.length === 0) {
      console.log('등록된 상품이 없습니다.');
      return false;
    } else {
      console.log('남아있는 재고는  : ', data[0].id);
      await productsRepository.insertSoldProduct(data[0].id);
      return true;
    }
  }

  async getSoldProducts() {
    console.log('getSoldProducts');
    const data = await productsRepository.getSoldProducts();

    let convertedDate = _.map(data, d => {
      d.date = moment(d.date).format('MMMM Do YYYY, h:mm:ss a');
      return d;
    });

    return convertedDate;

  }
}