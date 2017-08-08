const ENV = process.env.ENV || 'production';

const CONFIG =  {
  development: {
    WEB3_RPC_PROVIDER: 'http://localhost:8545',
    RAA_API_ROOT: 'https://risk.dharma.io/api'
  },

  production: {
    WEB3_RPC_PROVIDER: 'http://kovan.dharma.io',
    RAA_API_ROOT: 'https://risk.dharma.io/api'
  }
}

 module.exports = CONFIG[ENV];
