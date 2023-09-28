import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-contract-sizer";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.21",
    settings: {
      evmVersion: "london",
      optimizer: {
        enabled: true,
        runs: 1
      }
    },
  },
  gasReporter: {
    currency: "EUR",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    gasPriceApi: "https://api.etherscan.io/api?module=proxy&action=eth_gasPrice",
    enabled: true
  },
  networks: {
    goerli: {
      url: process.env.GOERLI_URL,
      accounts: process.env.REPOSITORY_DEPLOYER !== undefined ? [process.env.REPOSITORY_DEPLOYER] : [],
    },
    sepolia: {
      url: process.env.SEPOLIA_URL,
      accounts: process.env.REPOSITORY_DEPLOYER !== undefined ? [process.env.REPOSITORY_DEPLOYER] : [],
    },
    mumbai: {
      url: process.env.MUMBAI_URL,
      accounts: process.env.REPOSITORY_DEPLOYER !== undefined ? [process.env.REPOSITORY_DEPLOYER] : [],
    },
    moonbaseAlpha: {
      url: 'https://moonbeam-alpha.api.onfinality.io/public',
      chainId: 1287,
      accounts: process.env.REPOSITORY_DEPLOYER !== undefined ? [process.env.REPOSITORY_DEPLOYER] : [],
      gasPrice: 1000000000,
    },
    moonriver: {
      url: 'https://moonriver.api.onfinality.io/public',
      chainId: 1285,
      accounts: process.env.REPOSITORY_DEPLOYER !== undefined ? [process.env.REPOSITORY_DEPLOYER] : [],
      gasPrice: 1300000000,
    },
    arbitrumGoerli: {
      url: process.env.ARBITRUM_GOERLI_URL,
      accounts: process.env.REPOSITORY_DEPLOYER !== undefined ? [process.env.REPOSITORY_DEPLOYER] : [],
    },
    baseGoerli: {
      chainId: 84531,
      url: process.env.BASE_GOERLI_URL || 'https://goerli.base.org',
      accounts: process.env.REPOSITORY_DEPLOYER !== undefined ? [process.env.REPOSITORY_DEPLOYER] : [],
      gasPrice: 20000000,
    },
    polygon: {
      url: process.env.POLYGON_URL,
      accounts: process.env.REPOSITORY_DEPLOYER !== undefined ? [process.env.REPOSITORY_DEPLOYER] : [],
      gasPrice: 200000000000,
    },
    mainnet: {
      url: process.env.MAINNET_URL,
      accounts: process.env.REPOSITORY_DEPLOYER !== undefined ? [process.env.REPOSITORY_DEPLOYER] : [],
      gasPrice: 14000000000,
    },
    moonbeam: {
      url: 'https://rpc.api.moonbeam.network',
      chainId: 1284,
      accounts: process.env.REPOSITORY_DEPLOYER !== undefined ? [process.env.REPOSITORY_DEPLOYER] : [],
      gasPrice: 145000000000,
    },
    base: {
      url: process.env.BASE_URL,
      accounts: process.env.REPOSITORY_DEPLOYER !== undefined ? [process.env.REPOSITORY_DEPLOYER] : [],
    }
  },
  etherscan: {
    apiKey: {
      goerli: process.env.GOERLI_ETHERSCAN_API_KEY || "",
      sepolia: process.env.SEPOLIA_ETHERSCAN_API_KEY || "",
      polygonMumbai: process.env.MUMBAI_ETHERSCAN_API_KEY || "",
      moonbaseAlpha: process.env.MOONBEAM_MOONSCAN_APIKEY || "",
      moonriver: process.env.MOONRIVER_MOONSCAN_APIKEY || "",
      arbitrumGoerli: process.env.ARBITRUM_ARBISCAN_APIKEY || "",
      baseGoerli: process.env.BASE_BASESCAN_APIKEY || "",
      polygon: process.env.POLYGON_ETHERSCAN_API_KEY || "",
      mainnet: process.env.MAINNET_ETHERSCAN_API_KEY || "",
      moonbeam: process.env.MOONBEAM_MOONSCAN_APIKEY || "",
      base: process.env.BASE_BASESCAN_APIKEY || "",
    },
    customChains: [
      {
        network: "baseGoerli",
        chainId: 84531,
        urls: {
          apiURL: "https://api-goerli.basescan.org/api",
          browserURL: "https://goerli.basescan.org"
        }
      },
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org"
        }
      }
    ]
  },
};

export default config;
