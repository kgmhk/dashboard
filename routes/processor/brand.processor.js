import { BrandRepository } from '../repository/brand.repository';
import moment from "moment/moment";
import _ from 'lodash';

let brandRepository;

export class BrandProcessor {
  constructor() {
    brandRepository = new BrandRepository();
  }

  async getBrand() {
    const result = await brandRepository.getBrand();

    let convertedResult = _.map(result, r => {
      r.date = moment(r.date).format('MMMM Do YYYY, h:mm:ss a');
      return r;
    });

    return convertedResult;
  }

  async addBrand(brand) {
    const result = await brandRepository.addBrand(brand);
    if (result.errno && result.errno === 1062) {
      return {
        result: true,
        msg: '이미 등록된 브랜드 입니다.'
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

    console.log('result : ', result);
  }
}