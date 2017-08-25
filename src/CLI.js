'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _prompt = require('prompt');

var _prompt2 = _interopRequireDefault(_prompt);

var _web = require('web3');

var _web2 = _interopRequireDefault(_web);

var _dharmaJs = require('dharma-js');

var _dharmaJs2 = _interopRequireDefault(_dharmaJs);

var _Wallet = require('./Wallet');

var _Wallet2 = _interopRequireDefault(_Wallet);

var _web3ProviderEngine = require('web3-provider-engine');

var _web3ProviderEngine2 = _interopRequireDefault(_web3ProviderEngine);

var _rpc = require('web3-provider-engine/subproviders/rpc.js');

var _rpc2 = _interopRequireDefault(_rpc);

var _web3 = require('web3-provider-engine/subproviders/web3.js');

var _web4 = _interopRequireDefault(_web3);

var _Borrower = require('./Borrower');

var _Borrower2 = _interopRequireDefault(_Borrower);

var _Investor = require('./Investor');

var _Investor2 = _interopRequireDefault(_Investor);

var _Authenticate = require('./Authenticate');

var _Authenticate2 = _interopRequireDefault(_Authenticate);

var _commandLineCommands = require('command-line-commands');

var _commandLineCommands2 = _interopRequireDefault(_commandLineCommands);

var _commandLineArgs = require('command-line-args');

var _commandLineArgs2 = _interopRequireDefault(_commandLineArgs);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _Util = require('./Util');

var _Util2 = _interopRequireDefault(_Util);

var _prompts = require('./cli/prompts');

var _cliSpinner = require('cli-spinner');

var _Errors = require('./Errors');

var _Constants = require('./Constants');

var _opn = require('opn');

var _opn2 = _interopRequireDefault(_opn);

var _LoanDecorator = require('./decorators/LoanDecorator');

var _LoanDecorator2 = _interopRequireDefault(_LoanDecorator);

var _InvestorApp = require('./components/InvestorApp');

var _InvestorApp2 = _interopRequireDefault(_InvestorApp);

var _Liabilities = require('./models/Liabilities');

var _Liabilities2 = _interopRequireDefault(_Liabilities);

var _Config = require('./Config');

var _Config2 = _interopRequireDefault(_Config);

var _Faucet = require('./Faucet');

var _Faucet2 = _interopRequireDefault(_Faucet);

var _meow = require('meow');

var _meow2 = _interopRequireDefault(_meow);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CLI = function () {
  function CLI(dharma, wallet) {
    _classCallCheck(this, CLI);

    this.dharma = dharma;
    this.web3 = dharma.web3;
    this.wallet = wallet;
  }

  _createClass(CLI, [{
    key: 'walletFlow',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var address, balance, menu, loader, recipient, response, amount, _response, liabilities, options, _uuid, _loan, _decorator, _currentBalanceOwed, loanStr, _response2, uuid, loan, decorator, currentBalanceOwed, _amount, amountResponded, _response3;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                address = this.wallet.getAddress();
                _context.next = 3;
                return _Util2.default.getBalance(this.web3, address);

              case 3:
                balance = _context.sent;


                console.log('Testnet Balance: \u039E' + balance);

                _context.next = 7;
                return _inquirer2.default.prompt([_prompts.WalletFlow.mainMenu]);

              case 7:
                menu = _context.sent;
                loader = void 0;

                if (!(menu.choice === 'Send Ether')) {
                  _context.next = 32;
                  break;
                }

                recipient = void 0;

              case 11:
                if (recipient) {
                  _context.next = 18;
                  break;
                }

                _context.next = 14;
                return _inquirer2.default.prompt([_prompts.WalletFlow.enterRecipient]);

              case 14:
                response = _context.sent;

                if (!this.web3.isAddress(response.address)) {
                  console.log("Address is not a valid Ethereum address.");
                } else {
                  recipient = response.address;
                }
                _context.next = 11;
                break;

              case 18:
                amount = void 0;

              case 19:
                if (amount) {
                  _context.next = 26;
                  break;
                }

                _context.next = 22;
                return _inquirer2.default.prompt([_prompts.WalletFlow.enterAmount]);

              case 22:
                _response = _context.sent;

                if (balance.lte(_response.amount)) {
                  console.log("Your balance is too low :(");
                } else {
                  amount = this.web3.toWei(_response.amount, 'ether');
                }
                _context.next = 19;
                break;

              case 26:

                loader = new _cliSpinner.Spinner('Sending Ether to ' + recipient);
                loader.setSpinnerString(18);
                loader.start();

                this.web3.eth.sendTransaction({ from: address, to: recipient, value: amount }, function (err, result) {
                  loader.stop(true);
                  if (err) {
                    console.error(err);
                    process.exit(1);
                  } else {
                    console.log("Transaction successfully broadcasted!");
                    console.log("Transaction: " + result);
                    process.exit(0);
                  }
                });

                _context.next = 89;
                break;

              case 32:
                if (!(menu.choice === 'Make Loan Repayment')) {
                  _context.next = 89;
                  break;
                }

                loader = new _cliSpinner.Spinner('Loading...');
                loader.setSpinnerString(18);
                loader.start();
                _context.next = 38;
                return _Liabilities2.default.load(this.dharma);

              case 38:
                liabilities = _context.sent;

                loader.stop(true);

                options = [];
                _context.t0 = regeneratorRuntime.keys(liabilities.loans);

              case 42:
                if ((_context.t1 = _context.t0()).done) {
                  _context.next = 53;
                  break;
                }

                _uuid = _context.t1.value;
                _loan = liabilities.loans[_uuid];
                _decorator = new _LoanDecorator2.default(_loan);
                _context.next = 48;
                return _decorator.currentBalanceOwed();

              case 48:
                _currentBalanceOwed = _context.sent;
                loanStr = _uuid + " -- Principal: " + _decorator.principal() + " -- Current Balance Owed: " + _currentBalanceOwed;

                options.push(loanStr);
                _context.next = 42;
                break;

              case 53:
                _context.next = 55;
                return _inquirer2.default.prompt([_prompts.WalletFlow.chooseLoan(options)]);

              case 55:
                _response2 = _context.sent;
                uuid = _response2.choice.substr(0, 66);
                loan = liabilities.loans[uuid];
                decorator = new _LoanDecorator2.default(loan);
                _context.next = 61;
                return decorator.currentBalanceOwed();

              case 61:
                currentBalanceOwed = _context.sent;
                _amount = void 0;

              case 63:
                if (_amount) {
                  _context.next = 81;
                  break;
                }

                amountResponded = void 0;
                _context.next = 67;
                return _inquirer2.default.prompt([_prompts.WalletFlow.chooseAmount(currentBalanceOwed)]);

              case 67:
                _response2 = _context.sent;

                if (!(_response2.choice === 'Other')) {
                  _context.next = 75;
                  break;
                }

                _context.next = 71;
                return _inquirer2.default.prompt([_prompts.WalletFlow.enterAmount]);

              case 71:
                _response3 = _context.sent;

                amountResponded = this.web3.toWei(_response3.amount, 'ether');
                _context.next = 78;
                break;

              case 75:
                _context.next = 77;
                return loan.servicing.currentBalanceOwed();

              case 77:
                amountResponded = _context.sent;

              case 78:

                if (balance.lte(amountResponded)) {
                  console.log("Your balance is too low :(");
                } else {
                  _amount = amountResponded;
                }
                _context.next = 63;
                break;

              case 81:

                loader = new _cliSpinner.Spinner('Sending repayment to loan ' + uuid);
                loader.setSpinnerString(18);
                loader.start();

                _context.next = 86;
                return loan.repay(_amount, { from: address });

              case 86:

                loader.stop(true);
                console.log("Repayment successful.");

                process.exit(0);

              case 89:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function walletFlow() {
        return _ref.apply(this, arguments);
      }

      return walletFlow;
    }()
  }, {
    key: 'borrowFlow',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(amount, unit, network) {
        var address, authenticate, authToken, answer, borrower, loan, limit, stipendReceiptHash, loader, response, onAuctionStart, onReviewStart;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                address = this.wallet.getAddress();
                authenticate = new _Authenticate2.default();
                authToken = void 0;
                _context2.prev = 3;
                _context2.next = 6;
                return authenticate.getAuthToken();

              case 6:
                authToken = _context2.sent;
                _context2.next = 18;
                break;

              case 9:
                _context2.prev = 9;
                _context2.t0 = _context2['catch'](3);
                _context2.next = 13;
                return _inquirer2.default.prompt([_prompts.AuthenticateFlow.start]);

              case 13:
                answer = _context2.sent;

                if (!answer.confirmStart) {
                  _context2.next = 17;
                  break;
                }

                _context2.next = 17;
                return (0, _opn2.default)('https://authenticate.dharma.io', { wait: false });

              case 17:
                process.exit(0);

              case 18:
                borrower = new _Borrower2.default(this.web3, authToken);
                loan = void 0;
                limit = void 0;
                stipendReceiptHash = void 0;
                loader = new _cliSpinner.Spinner('Requesting attestation from Dharma Labs Inc.');

                loader.setSpinnerString(18);
                loader.start();

                // Request attestation from the Risk Assessment Attestor (i.e. Dharma)
                _context2.prev = 25;
                _context2.next = 28;
                return borrower.fetchLimit();

              case 28:
                limit = _context2.sent;
                _context2.next = 36;
                break;

              case 31:
                _context2.prev = 31;
                _context2.t1 = _context2['catch'](25);

                loader.stop(true);
                if (_context2.t1.message.includes('loan request has been rejected.')) {
                  console.error('Sorry -- your loan request has been denied.  Please try' + " again later.");
                } else {
                  console.error(_context2.t1.message);
                }
                process.exit(1);

              case 36:

                loader.stop(true);

                console.log("You've been approved for a loan of up to " + limit + " ether.");

                _context2.next = 40;
                return _inquirer2.default.prompt([_prompts.BorrowFlow.chooseAmount]);

              case 40:
                response = _context2.sent;

                if (response.amount > limit) {
                  console.error('Sorry -- you may only request up to ' + limit + ' ether.');
                  process.exit(1);
                }

                loader.start();
                loader.setSpinnerTitle("Requesting signed loan attestation...");

                loader.setSpinnerTitle("Deploying loan request for " + response.amount + ' ether.');

                onAuctionStart = function onAuctionStart(err, result) {
                  loader.setSpinnerTitle("Investors are bidding on your request.");
                };

                onReviewStart = this.loanReviewFlow(loader, borrower);
                _context2.prev = 47;
                _context2.next = 50;
                return borrower.broadcastLoanRequest(address, response.amount, onAuctionStart, onReviewStart);

              case 50:
                loader.setSpinnerTitle("Waiting for transaction to be mined...");
                _context2.next = 58;
                break;

              case 53:
                _context2.prev = 53;
                _context2.t2 = _context2['catch'](47);

                loader.stop(true);
                console.log(_context2.t2);
                process.exit();

              case 58:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[3, 9], [25, 31], [47, 53]]);
      }));

      function borrowFlow(_x, _x2, _x3) {
        return _ref2.apply(this, arguments);
      }

      return borrowFlow;
    }()
  }, {
    key: 'loanReviewFlow',
    value: function loanReviewFlow(loader, borrower) {
      var _this = this;

      return function () {
        var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(err, result) {
          var bids, loan, decorator, answer;
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  loader.stop(true);

                  if (!err) {
                    _context3.next = 12;
                    break;
                  }

                  _context3.t0 = err.error;
                  _context3.next = _context3.t0 === 'PRINCIPAL_UNMET' ? 5 : 7;
                  break;

                case 5:
                  console.error("Your loan request did not attract enough bidders " + "from the Dharma Loan Network.  Try again in 5 minutes.");
                  return _context3.abrupt('break', 9);

                case 7:
                  console.error(err);
                  return _context3.abrupt('break', 9);

                case 9:

                  process.exit();
                  _context3.next = 37;
                  break;

                case 12:
                  bids = result.bids, loan = result.loan;

                  loan.interestRate = bids.interestRate;
                  decorator = new _LoanDecorator2.default(loan);


                  console.log("\nYour loan request of " + decorator.principal() + " ether has been" + " approved at a " + decorator.interestRate() + " simple interest rate.\n");
                  console.log("\nYour last and only repayment date will be in 7 days, and you" + " will owe " + decorator.totalOwed());
                  _context3.next = 19;
                  return _inquirer2.default.prompt([_prompts.BorrowFlow.reviewLoanTerms]);

                case 19:
                  answer = _context3.sent;

                  if (!(answer.choice === 'Accept')) {
                    _context3.next = 30;
                    break;
                  }

                  loader.setSpinnerTitle("Broadcasting terms acceptance...");
                  loader.start();

                  _context3.next = 25;
                  return borrower.acceptLoanTerms(loan, bids.bids);

                case 25:
                  loader.stop(true);

                  console.log("Your loan has been funded and " + decorator.principal() + " ether has been transferred to " + "address " + loan.borrower);

                  process.exit();
                  _context3.next = 37;
                  break;

                case 30:
                  loader.setSpinnerTitle("Broadcasting terms rejection...");
                  loader.start();

                  _context3.next = 34;
                  return loan.rejectBids();

                case 34:
                  loader.stop(true);

                  console.log("You've rejected the loan terms presented to you.");

                  process.exit();

                case 37:
                case 'end':
                  return _context3.stop();
              }
            }
          }, _callee3, _this);
        }));

        return function (_x4, _x5) {
          return _ref3.apply(this, arguments);
        };
      }();
    }
  }, {
    key: 'investFlow',
    value: function () {
      var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(decisionEnginePath) {
        var investor, app;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                _context4.next = 3;
                return _Investor2.default.fromPath(this.dharma, this.wallet, decisionEnginePath);

              case 3:
                investor = _context4.sent;
                app = new _InvestorApp2.default(investor);
                _context4.next = 7;
                return app.start();

              case 7:
                _context4.next = 13;
                break;

              case 9:
                _context4.prev = 9;
                _context4.t0 = _context4['catch'](0);

                console.error(_context4.t0);
                process.exit();

              case 13:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[0, 9]]);
      }));

      function investFlow(_x6) {
        return _ref4.apply(this, arguments);
      }

      return investFlow;
    }()
  }], [{
    key: 'authenticate',
    value: function () {
      var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(args) {
        var cli, authenticate;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                cli = (0, _meow2.default)('\n      Usage\n        $ dharma authenticate <authToken>\n\n      Commands:\n        authToken     Auth token to save locally.  Go to https://authenticate.dharma.io\n                      in order to verify your identity and receive an auth token.\n    ');


                if (cli.input.length < 2) cli.showHelp();

                authenticate = new _Authenticate2.default();
                _context5.prev = 3;
                _context5.next = 6;
                return authenticate.setAuthToken(cli.input[1]);

              case 6:
                console.log("Your account is now authenticated!  You may broadcast requests " + 'to the Dharma Loan Network');
                _context5.next = 13;
                break;

              case 9:
                _context5.prev = 9;
                _context5.t0 = _context5['catch'](3);

                console.log(_context5.t0);
                console.error("Failed to write to local authentication token store.");

              case 13:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this, [[3, 9]]);
      }));

      function authenticate(_x7) {
        return _ref5.apply(this, arguments);
      }

      return authenticate;
    }()
  }, {
    key: 'entry',
    value: function () {
      var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(argv) {
        var cli;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                cli = (0, _meow2.default)('\n      Usage\n        $ dharma <command>\n\n      Commands:\n        borrow          Request a loan on the Dharma network.\n        invest          Start a daemon that auto-invests in loans on the Dharma Network\n                        according to programmable parameters.\n        wallet          Send ether, view your balance, and make loan repayments.\n        authenticate    Update local authentication token\n        init            Create a decision engine file.\n        faucet          Get some ether from the Dharma Testnet Faucet\n\n      Options:\n        --network, -n   Specify which testnet to use.  Accepted values are kovan, ropsten (default: kovan).\n    ');


                if (cli.input.length == 0) cli.showHelp();

                _context6.t0 = cli.input[0];
                _context6.next = _context6.t0 === "borrow" ? 5 : _context6.t0 === "authenticate" ? 8 : _context6.t0 === "invest" ? 11 : _context6.t0 === "wallet" ? 14 : _context6.t0 === "faucet" ? 17 : _context6.t0 === "init" ? 20 : 22;
                break;

              case 5:
                _context6.next = 7;
                return CLI.borrow(argv);

              case 7:
                return _context6.abrupt('break', 23);

              case 8:
                _context6.next = 10;
                return CLI.authenticate(argv);

              case 10:
                return _context6.abrupt('break', 23);

              case 11:
                _context6.next = 13;
                return CLI.invest(argv);

              case 13:
                return _context6.abrupt('break', 23);

              case 14:
                _context6.next = 16;
                return CLI.wallet(argv);

              case 16:
                return _context6.abrupt('break', 23);

              case 17:
                _context6.next = 19;
                return CLI.faucet(argv);

              case 19:
                return _context6.abrupt('break', 23);

              case 20:
                CLI.writeExampleEngine(argv);
                return _context6.abrupt('break', 23);

              case 22:
                return _context6.abrupt('break', 23);

              case 23:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function entry(_x8) {
        return _ref6.apply(this, arguments);
      }

      return entry;
    }()
  }, {
    key: 'writeExampleEngine',
    value: function writeExampleEngine(args) {
      var cli = (0, _meow2.default)('\n      Usage\n        $ dharma init [enginePath]\n\n      Parameters:\n        enginePath        Output path for example engine file. Default: ./\n    ');

      var path = void 0;
      if (cli.input.length < 2) {
        path = "./DecisionEngine.js";
      } else {
        path = cli.input[1];
      }

      _fs2.default.createReadStream(__dirname + '/../examples/DecisionEngine.js').pipe(_fs2.default.createWriteStream(path));

      console.log("Created example decision engine at " + path);
    }
  }, {
    key: 'faucet',
    value: function () {
      var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(args) {
        var optionDefinitions, params, cli, faucet, response, amount, loader, txHash, tx, answer;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                optionDefinitions = [, { name: 'network', alias: 'n', defaultValue: 'kovan', type: String }];
                params = (0, _commandLineArgs2.default)(optionDefinitions, {
                  argv: args
                });
                _context7.next = 4;
                return CLI.init(params.network);

              case 4:
                cli = _context7.sent;
                faucet = new _Faucet2.default(cli.dharma);
                _context7.next = 8;
                return _inquirer2.default.prompt([_prompts.FaucetFlow.howMuch]);

              case 8:
                response = _context7.sent;
                amount = void 0;
                _context7.t0 = response.choice;
                _context7.next = _context7.t0 === '1 ether for 1 day' ? 13 : _context7.t0 === '2.5 ether for 3 days' ? 15 : _context7.t0 === '6.25 ether for 9 days' ? 17 : 19;
                break;

              case 13:
                amount = 1;
                return _context7.abrupt('break', 21);

              case 15:
                amount = 2.5;
                return _context7.abrupt('break', 21);

              case 17:
                amount = 6.25;
                return _context7.abrupt('break', 21);

              case 19:
                amount = 1;
                return _context7.abrupt('break', 21);

              case 21:
                loader = new _cliSpinner.Spinner('Requesting ether from faucet...');

                loader.setSpinnerString(18);
                loader.start();

                _context7.prev = 24;
                _context7.next = 27;
                return faucet.requestEther(cli.wallet, amount);

              case 27:
                txHash = _context7.sent;
                _context7.next = 30;
                return _Util2.default.transactionMined(cli.web3, txHash);

              case 30:
                tx = _context7.sent;
                _context7.next = 47;
                break;

              case 33:
                _context7.prev = 33;
                _context7.t1 = _context7['catch'](24);

                loader.stop();

                if (!(_context7.t1.type === 'AuthenticationError')) {
                  _context7.next = 45;
                  break;
                }

                _context7.next = 39;
                return _inquirer2.default.prompt([_prompts.AuthenticateFlow.start]);

              case 39:
                answer = _context7.sent;

                if (!answer.confirmStart) {
                  _context7.next = 43;
                  break;
                }

                _context7.next = 43;
                return (0, _opn2.default)('https://authenticate.dharma.io', { wait: false });

              case 43:
                _context7.next = 47;
                break;

              case 45:
                console.error(_context7.t1.message);
                process.exit(1);

              case 47:

                loader.stop(true);

                console.log(amount + " ether has been sent to address " + cli.wallet.getAddress());
                process.exit(0);

              case 50:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this, [[24, 33]]);
      }));

      function faucet(_x9) {
        return _ref7.apply(this, arguments);
      }

      return faucet;
    }()
  }, {
    key: 'borrow',
    value: function () {
      var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(args) {
        var optionDefinitions, params, cli;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                optionDefinitions = [{ name: 'unit', alias: 'u', defaultValue: 'ether', type: String }, { name: 'amount', alias: 'a', defaultOption: true, type: Number }, { name: 'network', alias: 'n', defaultValue: 'kovan', type: String }];
                params = (0, _commandLineArgs2.default)(optionDefinitions, {
                  argv: args
                });
                _context8.next = 4;
                return CLI.init(params.network);

              case 4:
                cli = _context8.sent;
                _context8.next = 7;
                return cli.borrowFlow(params.amount, params.unit);

              case 7:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function borrow(_x10) {
        return _ref8.apply(this, arguments);
      }

      return borrow;
    }()
  }, {
    key: 'invest',
    value: function () {
      var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee9(argv) {
        var args, optionDefinitions, params, cli;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                args = (0, _meow2.default)('\n      Usage\n        $ dharma invest <enginePath>\n\n      Parameters:\n        enginePath      Path to the decision engine the Dharma CLI will use to\n                        make investment decisions.  Run \'dharma init\' in order\n                        to generate an example decision engine.\n      Options:\n        --network, -n   Specify which testnet to use.  Accepted values are kovan, ropsten (default: kovan).\n    ');


                if (args.input.length < 2) args.showHelp();

                optionDefinitions = [{ name: 'network', alias: 'n', defaultValue: 'kovan', type: String }];
                params = (0, _commandLineArgs2.default)(optionDefinitions, { argv: argv });
                _context9.next = 6;
                return CLI.init(params.network);

              case 6:
                cli = _context9.sent;
                _context9.next = 9;
                return cli.investFlow(args.input[1]);

              case 9:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function invest(_x11) {
        return _ref9.apply(this, arguments);
      }

      return invest;
    }()
  }, {
    key: 'wallet',
    value: function () {
      var _ref10 = _asyncToGenerator(regeneratorRuntime.mark(function _callee10(argv) {
        var optionDefinitions, params, cli;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                optionDefinitions = [{ name: 'network', alias: 'n', defaultValue: 'kovan', type: String }];
                params = (0, _commandLineArgs2.default)(optionDefinitions, { argv: argv });
                _context10.next = 4;
                return CLI.init(params.network);

              case 4:
                cli = _context10.sent;
                _context10.next = 7;
                return cli.walletFlow();

              case 7:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function wallet(_x12) {
        return _ref10.apply(this, arguments);
      }

      return wallet;
    }()
  }, {
    key: 'init',
    value: function () {
      var _ref11 = _asyncToGenerator(regeneratorRuntime.mark(function _callee11(network) {
        var walletExists, wallet, engine, web3, dharma;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.next = 2;
                return _Wallet2.default.walletExists();

              case 2:
                walletExists = _context11.sent;
                wallet = void 0;

                if (!walletExists) {
                  _context11.next = 10;
                  break;
                }

                _context11.next = 7;
                return CLI.loadWalletFlow();

              case 7:
                wallet = _context11.sent;
                _context11.next = 13;
                break;

              case 10:
                _context11.next = 12;
                return CLI.generateWalletFlow();

              case 12:
                wallet = _context11.sent;

              case 13:
                engine = new _web3ProviderEngine2.default();
                web3 = new _web2.default(engine);


                engine.addProvider(wallet.getSubprovider());
                engine.addProvider(new _web4.default(new _web2.default.providers.HttpProvider(_Config2.default.WEB3_RPC_PROVIDER[network])));
                engine.start();

                dharma = new _dharmaJs2.default(web3);
                return _context11.abrupt('return', new CLI(dharma, wallet));

              case 20:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function init(_x13) {
        return _ref11.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: 'loadWalletFlow',
    value: function () {
      var _ref12 = _asyncToGenerator(regeneratorRuntime.mark(function _callee12(walletStoreFile) {
        var choice, wallet, answer, _ref13, mnemonic, passphrase;

        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.next = 2;
                return _inquirer2.default.prompt([_prompts.LoadWalletFlow.unlockOptions]);

              case 2:
                choice = _context12.sent;
                wallet = void 0;

                if (!(choice.unlockChoice === 'Enter passphrase')) {
                  _context12.next = 25;
                  break;
                }

              case 5:
                if (!true) {
                  _context12.next = 23;
                  break;
                }

                _context12.next = 8;
                return _inquirer2.default.prompt([_prompts.LoadWalletFlow.enterPassphrase]);

              case 8:
                answer = _context12.sent;
                _context12.prev = 9;
                _context12.next = 12;
                return _Wallet2.default.getWallet(answer.passphrase, walletStoreFile);

              case 12:
                wallet = _context12.sent;

                console.log("Wallet unlocked!");
                console.log("Testnet Address: " + wallet.getAddress());

                return _context12.abrupt('break', 23);

              case 18:
                _context12.prev = 18;
                _context12.t0 = _context12['catch'](9);

                console.error("Incorrect passphrase.  Please try again.");

              case 21:
                _context12.next = 5;
                break;

              case 23:
                _context12.next = 50;
                break;

              case 25:
                if (!true) {
                  _context12.next = 44;
                  break;
                }

                _context12.next = 28;
                return _inquirer2.default.prompt([_prompts.LoadWalletFlow.enterMnemonic]);

              case 28:
                _ref13 = _context12.sent;
                mnemonic = _ref13.mnemonic;
                _context12.prev = 30;
                _context12.next = 33;
                return _Wallet2.default.recoverWallet(mnemonic, walletStoreFile);

              case 33:
                wallet = _context12.sent;

                console.log("Wallet has been recovered!");
                return _context12.abrupt('break', 44);

              case 38:
                _context12.prev = 38;
                _context12.t1 = _context12['catch'](30);

                console.log(_context12.t1);
                console.error("Incorrect seed phrase.  Please try again.");

              case 42:
                _context12.next = 25;
                break;

              case 44:
                _context12.next = 46;
                return this.passphraseFlow();

              case 46:
                passphrase = _context12.sent;
                _context12.next = 49;
                return wallet.save(passphrase);

              case 49:

                console.log("Wallet saved and re-encrypted with new passphrase.");

              case 50:
                return _context12.abrupt('return', wallet);

              case 51:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee12, this, [[9, 18], [30, 38]]);
      }));

      function loadWalletFlow(_x14) {
        return _ref12.apply(this, arguments);
      }

      return loadWalletFlow;
    }()
  }, {
    key: 'passphraseFlow',
    value: function () {
      var _ref14 = _asyncToGenerator(regeneratorRuntime.mark(function _callee13() {
        var passphrase, passphraseAnswers;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                passphrase = void 0;

              case 1:
                if (passphrase) {
                  _context13.next = 8;
                  break;
                }

                _context13.next = 4;
                return _inquirer2.default.prompt([_prompts.LoadWalletFlow.choosePassphrase, _prompts.LoadWalletFlow.confirmPassphrase]);

              case 4:
                passphraseAnswers = _context13.sent;


                if (passphraseAnswers.passphrase !== passphraseAnswers.passphraseConfirmation) {
                  console.error("Confirmation does not match passphrase, try again.");
                } else {
                  passphrase = passphraseAnswers.passphrase;
                }
                _context13.next = 1;
                break;

              case 8:
                return _context13.abrupt('return', passphrase);

              case 9:
              case 'end':
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function passphraseFlow() {
        return _ref14.apply(this, arguments);
      }

      return passphraseFlow;
    }()
  }, {
    key: 'generateWalletFlow',
    value: function () {
      var _ref15 = _asyncToGenerator(regeneratorRuntime.mark(function _callee14(walletStoreFile) {
        var passphrase, wallet, address, mnemonic;
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                _context14.next = 2;
                return _inquirer2.default.prompt([_prompts.LoadWalletFlow.start]);

              case 2:
                _context14.next = 4;
                return this.passphraseFlow();

              case 4:
                passphrase = _context14.sent;
                _context14.next = 7;
                return _Wallet2.default.generate(passphrase, walletStoreFile);

              case 7:
                wallet = _context14.sent;
                address = wallet.getAddress();
                mnemonic = wallet.getMnemonic();


                console.log("You've generated a local wallet with the following address: " + address);
                console.log("Please write down the following recovery phrase and store it in " + "a safe place -- if you forget your passphrase, you will not be able to " + "recover your funds without the recovery phrase");
                console.log(mnemonic);

                return _context14.abrupt('return', wallet);

              case 14:
              case 'end':
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      function generateWalletFlow(_x15) {
        return _ref15.apply(this, arguments);
      }

      return generateWalletFlow;
    }()
  }]);

  return CLI;
}();

module.exports = CLI;