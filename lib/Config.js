const ENV = process.env.ENV || 'production';

const CONFIG =  {
  development: {
    WEB3_RPC_PROVIDER: {
      kovan: 'http://localhost:8545',
      ropsten: 'http://localhost:8546'
    },
    RAA_API_ROOT: 'https://risk.dharma.io/api'
  },

  production: {
    WEB3_RPC_PROVIDER: {
      kovan: 'http://kovan.dharma.io:8545',
      ropsten: 'http://ec2-52-38-162-7.us-west-2.compute.amazonaws.com:8545'
    },
    RAA_API_ROOT: 'https://risk.dharma.io/api'
  }
}

 module.exports = CONFIG[ENV];
