import { AccountRepository } from '../repository/account.repository';
let accountRepository;

export class AccountProcessor {
  constructor() {
    accountRepository = new AccountRepository();
  }

  async getAccount(id, pw) {

    const rows = await accountRepository.getAccount(id, pw);

    if (rows.length === 0) {
      return false;

    } else {
      return true;
    }
  }
}