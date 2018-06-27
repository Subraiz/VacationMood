console.log("Server test");

const assert = require('assert');
const Web3 = require('web3');

var contract = null;
var abi = null;
var contractAddress = "0x4de397226ecf480d7ea1873f7ee0295c4616cf22";
var account = null;
//var Web3 = require('web3');
if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
  web3 = new Web3(web3.currentProvider);
}
function loadABI() {
  return new Promise(function(resolve, reject) {
    fetch("../../build/contracts/VacationMood.json")
    .then(r => r.json())
    .then(json => {
      abi = json.abi;
      resolve(abi);
    });
  });
}

function getTokens() {
  var account = web3.eth.accounts[0];

  this.contract.tokenOfOwnerByIndex.call(account, 0, (err, result) => {
    if(err) {
      console.log(err);
      return;
    }

    console.log(result.valueOf());
  });
}

loadABI().then(a => {
  contract = web3.eth.contract(abi).at(contractAddress);
  console.log("Loaded contract...");
  getTokens();
});
