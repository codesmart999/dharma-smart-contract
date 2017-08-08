import Authenticate from './Authenticate';
import {AuthenticationError, RejectionError} from './Errors';
import request from 'request';
import _ from 'lodash';
import BigNumber from 'bignumber.js';
import Util from './Util';
import Config from './Config';
import Liabilities from './models/Liabilities';
import DharmaClient from 'dharma-client';

class Borrower {
  constructor(web3, authToken) {
    const env = process.env.ENV || 'production';

    this.dharmaClient = new DharmaClient(web3, authToken, env);
  }

  async fetchLimit() {
    return await this.dharmaClient.fetchLimit();
  }

  async requestSignedLoan(address, amount) {
    return await this.dharmaClient.requestSignedLoan(address, amount);
  }

  async requestDeploymentStipend(address) {
    return await this.dharmaClient.requestDeploymentStipend(address);
  }

  async broadcastLoanRequest(address, amount, deployedCallback, reviewCallback) {
    return await this.dharmaClient.broadcastLoanRequest(address, amount,
      deployedCallback, reviewCallback);
  }

  async acceptLoanTerms(loan, bids) {
    await loan.acceptBids(bids);

    let liabilities;
    try {
      liabilities = await Liabilities.load(this.dharma);
    } catch (err) {
      liabilities = new Liabilities();
    }

    liabilities.addLoan(loan);
    await liabilities.save();
  }
}

module.exports = Borrower;
