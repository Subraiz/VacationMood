var HDWalletProvider = require("truffle-hdwallet-provider");
var testnetMnemonic = "mutual life endless direct direct shell rich dance scheme hunt into lend hero spare coral";
var testnetWalletAddress = "0xbf20394C1a0F6784e5A1fD6c4C2e6baCDb8DD4c6";
var testnetContractAddress = "0x032875caadfec8808792843c7e00bfcf1880513a";

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
      network_id: 3
    },
    mainnet: {
      provider: function() {
        return new HDWalletProvider(mainnetMnemonic, "https://mainnet.infura.io/F5xdDA6sjrIgRJNUivmc")
      },
      network_id: 1,
      gas: 6500000,
      gasPrice: 100000000000
    },
    "live": {
      network_id: 1,
      host: "127.0.0.1",
      port: 8546   // Different than the default below
    }
  }
};
