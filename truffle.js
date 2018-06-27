var HDWalletProvider = require("truffle-hdwallet-provider");
var testnetMnemonic = "mutual life endless direct direct shell rich dance scheme hunt into lend hero spare coral";
var testnetWalletAddress = "0xbf20394C1a0F6784e5A1fD6c4C2e6baCDb8DD4c6";
var testnetContractAddress = "0xe431640d40eb1a84be6a536705d77c126a826003";

var mainnetMnemonic = "XXX";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(testnetMnemonic, "https://ropsten.infura.io/F5xdDA6sjrIgRJNUivmc")
      },
      network_id: 3,
      gas: 4800000,
      gasPrice: 24000000000
    },
    mainnet: {
      provider: function() {
        return new HDWalletProvider(mainnetMnemonic, "https://mainnet.infura.io/F5xdDA6sjrIgRJNUivmc")
      },
      network_id: 1,
    }
  }
};
