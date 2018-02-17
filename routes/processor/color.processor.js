import { ColorRepository } from '../repository/color.repository';
import moment from "moment/moment";
import _ from 'lodash';

let colorRepository;

export class ColorProcessor {
  constructor() {
    colorRepository = new ColorRepository();
  }

  async getColor() {
    const result = await colorRepository.getColor();

    let convertedResult = _.map(result, r => {
      r.date = moment(r.date).format('MMMM Do YYYY, h:mm:ss a');
      return r;
    });

    console.log('convertedResult : ', convertedResult);
    return convertedResult;
  }

  async addColor(color) {
    const result = await colorRepository.addColor(color);
    if (result.errno && result.errno === 1062) {
      return {
        result: true,
        msg: '이미 등록된 색상 입니다.'
      }
    } else if (result.errno) {
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