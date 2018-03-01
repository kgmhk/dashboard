import _ from 'lodash';
import moment from 'moment';
import { ClientRepository } from '../repository/client.repository';

let clientRepository;

export class ClientProcessor {
  constructor() {
    clientRepository = new ClientRepository();
  }

  async getClient() {
    let result = await clientRepository.getClient();

    let convertedResult = _.map(result, r => {
      r.date = moment(r.date).format('MMMM Do YYYY, h:mm:ss a');
      return r;
    });

    return convertedResult;
  }

  async addClient(client, margin) {
    const result = await clientRepository.addClient(client, margin);
    if (result.errno && result.errno === 1062) {
      return {
        result: true,
        msg: '이미 등록된 거래처 입니다.'
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