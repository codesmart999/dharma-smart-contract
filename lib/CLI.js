import prompt from 'prompt';
import Web3 from 'web3';
import Dharma from 'dharma-js';
import Wallet from './Wallet';
import ProviderEngine from 'web3-provider-engine';
import RpcSubprovider from 'web3-provider-engine/subproviders/rpc.js';
import Web3Subprovider from 'web3-provider-engine/subproviders/web3.js';
import Borrower from './Borrower';
import Investor from './Investor';
import Authenticate from './Authenticate';
import commandLineCommands from 'command-line-commands';
import parseCommandArgs from 'command-line-args';
import inquirer from 'inquirer';
import Util from './Util';
import {LoadWalletFlow, WalletFlow,
   AuthenticateFlow, BorrowFlow, FaucetFlow} from './cli/prompts';
import {Spinner} from 'cli-spinner';
import {AuthenticationError} from './Errors';
import {NETWORK_ID} from './Constants';
import opn from 'opn';
import LoanDecorator from './decorators/LoanDecorator';
import InvestorApp from './components/InvestorApp';
import Liabilities from './models/Liabilities';
import Config from './Config';
import Faucet from './Faucet';
import meow from 'meow';
import fs from 'fs';
import os from 'os';


class CLI {
  constructor(dharma, wallet) {
    this.dharma = dharma;
    this.web3 = dharma.web3;
    this.wallet = wallet;
  }

  static async authenticate(args) {
    const cli = meow(`
      Usage
        $ dharma authenticate <authToken>

      Commands:
        authToken     Auth token to save locally.  Go to https://authenticate.dharma.io
                      in order to verify your identity and receive an auth token.
    `)

    if (cli.input.length < 2)
      cli.showHelp();

    const authenticate = new Authenticate();

    try {
      await authenticate.setAuthToken(cli.input[1]);
      console.log("Your account is now authenticated!  You may broadcast requests "
        + 'to the Dharma Loan Network');
    } catch (err) {
      console.log(err);
      console.error("Failed to write to local authentication token store.");
    }
  }

  static async entry(argv) {
    const cli = meow(`
      Usage
        $ dharma <command>

      Commands:
        borrow          Request a loan on the Dharma network.
        invest          Start a daemon that auto-invests in loans on the Dharma Network
                        according to programmable parameters.
        wallet          Send ether, view your balance, and make loan repayments.
        authenticate    Update local authentication token
        init            Create a decision engine file.
        faucet          Get some ether from the Dharma Testnet Faucet

      Options:
        --network, -n   Specify which testnet to use.  Accepted values are kovan, ropsten (default: kovan).
    `)

    if (cli.input.length == 0)
      cli.showHelp();

    switch (cli.input[0]) {
      case "borrow":
        await CLI.borrow(argv);
        break;
      case "authenticate":
        await CLI.authenticate(argv);
        break;
      case "invest":
        await CLI.invest(argv);
        break;
      case "wallet":
        await CLI.wallet(argv);
        break;
      case "faucet":
        await CLI.faucet(argv);
        break;
      case "init":
        CLI.writeExampleEngine(argv);
        break;
      default:
        // do something
        break;
    }
  }

  static writeExampleEngine(args) {
    const cli = meow(`
      Usage
        $ dharma init [enginePath]

      Parameters:
        enginePath        Output path for example engine file. Default: ./
    `)

    let path;
    if (cli.input.length < 2) {
      path = "./DecisionEngine.js";
    } else {
      path = cli.input[1];
    }

    fs.createReadStream(__dirname + '/../examples/DecisionEngine.js')
      .pipe(fs.createWriteStream(path));

    console.log("Created example decision engine at " + path);
  }

  static async faucet(args) {
    const optionDefinitions = [,
      { name: 'network', alias: 'n', defaultValue: 'kovan', type: String }
    ]

    const params = parseCommandArgs(optionDefinitions, {
      argv: args
    });

    const cli = await CLI.init(params.network);
    const faucet = new Faucet(cli.dharma);

    const response = await inquirer.prompt([FaucetFlow.howMuch]);
    let amount;
    switch (response.choice) {
      case '1 ether for 1 day':
        amount = 1;
        break;
      case '2.5 ether for 3 days':
        amount = 2.5;
        break;
      case '6.25 ether for 9 days' :
        amount = 6.25;
        break;
      default:
        amount = 1;
        break;
    }

    let loader = new Spinner('Requesting ether from faucet...');
    loader.setSpinnerString(18);
    loader.start();

    try {
      const txHash = await faucet.requestEther(cli.wallet, amount);
      const tx = await Util.transactionMined(cli.web3, txHash);
    } catch (err) {
      loader.stop();
      if (err.type === 'AuthenticationError') {
        const answer = await inquirer.prompt([AuthenticateFlow.start]);
        if (answer.confirmStart) {
          await opn('https://authenticate.dharma.io', { wait: false });
        }
      } else {
        console.error(err.message);
        process.exit(1);
      }
    }

    loader.stop(true);

    console.log(amount + " ether has been sent to address " + cli.wallet.getAddress());
    process.exit(0);
  }

  static async borrow(args) {
    const optionDefinitions = [
      { name: 'unit', alias: 'u', defaultValue: 'ether', type: String },
      { name: 'amount', alias: 'a', defaultOption: true, type: Number },
      { name: 'network', alias: 'n', defaultValue: 'kovan', type: String }
    ]

    const params = parseCommandArgs(optionDefinitions, {
      argv: args
    });

    const cli = await CLI.init(params.network);
    await cli.borrowFlow(params.amount, params.unit);
  }

  static async invest(argv) {
    const args = meow(`
      Usage
        $ dharma invest <enginePath>

      Parameters:
        enginePath      Path to the decision engine the Dharma CLI will use to
                        make investment decisions.  Run 'dharma init' in order
                        to generate an example decision engine.
      Options:
        --network, -n   Specify which testnet to use.  Accepted values are kovan, ropsten (default: kovan).
    `)

    if (args.input.length < 2)
      args.showHelp();

    const optionDefinitions = [
      { name: 'network', alias: 'n', defaultValue: 'kovan', type: String }
    ]

    const params = parseCommandArgs(optionDefinitions, { argv });

    const cli = await CLI.init(params.network);
    await cli.investFlow(args.input[1]);
  }

  static async wallet(argv) {
    const optionDefinitions = [
      { name: 'network', alias: 'n', defaultValue: 'kovan', type: String }
    ]

    const params = parseCommandArgs(optionDefinitions, { argv });

    const cli = await CLI.init(params.network);
    await cli.walletFlow();
  }

  async walletFlow() {
  const address = this.wallet.getAddress();
  const balance = await Util.getBalance(this.web3, address);

  console.log("Testnet Balance: \u039E" + balance);

  const menu = await inquirer.prompt([WalletFlow.mainMenu]);
    let loader;
    if (menu.choice === 'Send Ether') {
      let recipient;
      while (!recipient) {
        let response = await inquirer.prompt([WalletFlow.enterRecipient]);
        if (!this.web3.isAddress(response.address)) {
          console.log("Address is not a valid Ethereum address.");
        } else {
          recipient = response.address;
        }
      }

      let amount;
      while (!amount) {
        let response = await inquirer.prompt([WalletFlow.enterAmount]);
        if (balance.lte(response.amount)) {
          console.log("Your balance is too low :(");
        } else {
          amount = this.web3.toWei(response.amount, 'ether');
        }
      }

      loader = new Spinner('Sending Ether to ' + recipient);
      loader.setSpinnerString(18);
      loader.start();

      this.web3.eth.sendTransaction({ from: address, to: recipient, value: amount }, (err, result) => {
        loader.stop(true);
        if (err) {
          console.error(err)
          process.exit(1)
        } else {
          console.log("Transaction successfully broadcasted!")
          console.log("Transaction: " + result);
          process.exit(0);
        }
      });

    } else if (menu.choice === 'Make Loan Repayment') {
      loader = new Spinner('Loading...');
      loader.setSpinnerString(18);
      loader.start();
      const liabilities = await Liabilities.load(this.dharma);
      loader.stop(true);

      let options = []
      for (let uuid in liabilities.loans) {
        const loan = liabilities.loans[uuid];
        const decorator = new LoanDecorator(loan);
        const currentBalanceOwed = await decorator.currentBalanceOwed();
        const loanStr = uuid + " -- Principal: " + decorator.principal() +
          " -- Current Balance Owed: " + currentBalanceOwed;
        options.push(loanStr);
      }

      let response = await inquirer.prompt([WalletFlow.chooseLoan(options)])
      const uuid = response.choice.substr(0,66);
      const loan = liabilities.loans[uuid];
      const decorator = new LoanDecorator(loan);
      const currentBalanceOwed = await decorator.currentBalanceOwed()

      let amount;
      while (!amount) {
        let amountResponded;
        response = await inquirer.prompt([WalletFlow.chooseAmount(currentBalanceOwed)])
        if (response.choice === 'Other') {
          let response = await inquirer.prompt([WalletFlow.enterAmount]);
          amountResponded = this.web3.toWei(response.amount, 'ether');
        } else {
          amountResponded = await loan.servicing.currentBalanceOwed();
        }

        if (balance.lte(amountResponded)) {
          console.log("Your balance is too low :(");
        } else {
          amount = amountResponded;
        }
      }

      loader = new Spinner('Sending repayment to loan ' + uuid);
      loader.setSpinnerString(18);
      loader.start();

      await loan.repay(amount, { from: address });

      loader.stop(true);
      console.log("Repayment successful.");

      process.exit(0);
    }
  }

  static async init(network) {
    const walletExists = await Wallet.walletExists();
    let wallet;
    if (walletExists) {
      wallet = await CLI.loadWalletFlow();
    } else {
      wallet = await CLI.generateWalletFlow()
    }

    const engine = new ProviderEngine();
    const web3 = new Web3(engine);

    engine.addProvider(wallet.getSubprovider());
    engine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider(Config.WEB3_RPC_PROVIDER[network])))
    engine.start();

    const dharma = new Dharma(web3);

    return new CLI(dharma, wallet);
  }

  static async loadWalletFlow(walletStoreFile) {
    const choice = await inquirer.prompt([LoadWalletFlow.unlockOptions]);

    let wallet;
    if (choice.unlockChoice === 'Enter passphrase') {
      while (true) {
        const answer = await inquirer.prompt([LoadWalletFlow.enterPassphrase]);

        try {
          wallet = await Wallet.getWallet(answer.passphrase, walletStoreFile);
          console.log("Wallet unlocked!");
          console.log("Testnet Address: " + wallet.getAddress());

          break;
        } catch (err) {
          console.error("Incorrect passphrase.  Please try again.");
        }
      }
    } else {
      while (true) {
        let {mnemonic} = await inquirer.prompt([LoadWalletFlow.enterMnemonic]);

        try {
          wallet = await Wallet.recoverWallet(mnemonic, walletStoreFile);
          console.log("Wallet has been recovered!");
          break;
        } catch (err) {
          console.log(err)
          console.error("Incorrect seed phrase.  Please try again.");
        }
      }

      const passphrase = await this.passphraseFlow();
      await wallet.save(passphrase);

      console.log("Wallet saved and re-encrypted with new passphrase.")
    }

    return wallet;
  }

  static async passphraseFlow() {
    let passphrase;
    while (!passphrase) {
      let passphraseAnswers = await inquirer.prompt([
        LoadWalletFlow.choosePassphrase, LoadWalletFlow.confirmPassphrase
      ])

      if (passphraseAnswers.passphrase !== passphraseAnswers.passphraseConfirmation) {
        console.error("Confirmation does not match passphrase, try again.");
      } else {
        passphrase = passphraseAnswers.passphrase;
      }
    }

    return passphrase;
  }

  static async generateWalletFlow(walletStoreFile) {
    await inquirer.prompt([LoadWalletFlow.start])

    const passphrase = await this.passphraseFlow();

    const wallet = await Wallet.generate(passphrase, walletStoreFile);

    const address = wallet.getAddress();
    const mnemonic = wallet.getMnemonic();

    console.log("You've generated a local wallet with the following address: " + address);
    console.log("Please write down the following recovery phrase and store it in " +
      "a safe place -- if you forget your passphrase, you will not be able to " +
      "recover your funds without the recovery phrase");
    console.log(mnemonic);

    return wallet;
  }

  async borrowFlow(amount, unit, network) {
    const address = this.wallet.getAddress();

    const authenticate = new Authenticate()
    let authToken;

    try {
      authToken = await authenticate.getAuthToken();
    } catch (err) {
      const answer = await inquirer.prompt([AuthenticateFlow.start]);
      if (answer.confirmStart) {
        await opn('https://authenticate.dharma.io', { wait: false });
      }
      process.exit(0);
    }

    const borrower = new Borrower(this.web3, authToken);

    let loan;
    let limit;
    let stipendReceiptHash;

    const loader = new Spinner('Requesting attestation from Dharma Labs Inc.')
    loader.setSpinnerString(18);
    loader.start();

    // Request attestation from the Risk Assessment Attestor (i.e. Dharma)
    try {
      limit = await borrower.fetchLimit();
    } catch (err) {
      loader.stop(true);
      if (err.message.includes('loan request has been rejected.')) {
        console.error('Sorry -- your loan request has been denied.  Please try' +
          " again later.");
      } else {
        console.error(err.message);
      }
      process.exit(1);
    }

    loader.stop(true);

    console.log("You've been approved for a loan of up to " + limit +
      " ether.");

    const response = await inquirer.prompt([BorrowFlow.chooseAmount]);
    if (response.amount > limit) {
      console.error('Sorry -- you may only request up to ' + limit +
        ' ether.');
      process.exit(1);
    }

    loader.start()
    loader.setSpinnerTitle("Requesting signed loan attestation...");

    loader.setSpinnerTitle("Deploying loan request for " + response.amount + ' ether.');

    const onAuctionStart = (err, result) => {
      loader.setSpinnerTitle("Investors are bidding on your request.");
    }

    const onReviewStart = this.loanReviewFlow(loader, borrower);

    try {
      await borrower.broadcastLoanRequest(address, response.amount, onAuctionStart, onReviewStart);
      loader.setSpinnerTitle("Waiting for transaction to be mined...");
    } catch (err) {
      loader.stop(true)
      console.log(err);
      process.exit();
    }
  }

  loanReviewFlow(loader, borrower) {
    return async (err, result) => {
      loader.stop(true);

      if (err) {
        switch(err.error) {
          case 'PRINCIPAL_UNMET':
            console.error("Your loan request did not attract enough bidders " +
              "from the Dharma Loan Network.  Try again in 5 minutes.")
            break;
          default:
            console.error(err);
            break;
        }

        process.exit();
      } else {
        const { bids, loan } = result;
        loan.interestRate = bids.interestRate;
        const decorator = new LoanDecorator(loan);

        console.log("\nYour loan request of " + decorator.principal() + " ether has been" +
          " approved at a " + decorator.interestRate() + " simple interest rate.\n")
        console.log("\nYour last and only repayment date will be in 7 days, and you" +
          " will owe " + decorator.totalOwed());
        const answer = await inquirer.prompt([BorrowFlow.reviewLoanTerms]);

        if (answer.choice === 'Accept') {
          loader.setSpinnerTitle("Broadcasting terms acceptance...");
          loader.start();

          await borrower.acceptLoanTerms(loan, bids.bids);
          loader.stop(true);

          console.log("Your loan has been funded and " +
            decorator.principal() + " ether has been transferred to " +
            "address " + loan.borrower);

          process.exit();
        } else {
          loader.setSpinnerTitle("Broadcasting terms rejection...");
          loader.start();

          await loan.rejectBids();
          loader.stop(true);

          console.log("You've rejected the loan terms presented to you.");

          process.exit();
        }
      }
    }
  }

  async investFlow(decisionEnginePath) {
    try {
      const investor = await Investor.fromPath(this.dharma, this.wallet,
        decisionEnginePath);
      const app = new InvestorApp(investor);
      await app.start()
    } catch (err) {
      console.error(err)
      process.exit();
    }
  }
}

module.exports = CLI;
