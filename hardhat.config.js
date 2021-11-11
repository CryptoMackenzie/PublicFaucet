require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  etherscan: {
    apiKey: "JFZ3TQ9TASVPJX47ZBN2DM4T7DQZF7DQ6G"
  },
  defaultNetwork: "testnet",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    hardhat: {
    },
    testnet: {
      url: "https://speedy-nodes-nyc.moralis.io/7e9361d53693a6e439879bb5/polygon/mumbai",
      chainId: 80001,
      accounts: {mnemonic: "fiscal tooth cube senior boat thunder pattern tree moment tonight detail lizard"}
    }
  },
  solidity: "0.8.4",
};
