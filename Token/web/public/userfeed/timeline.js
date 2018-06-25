var aliceInstance = null;
var aliceContract = "0x4de397226ECF480D7Ea1873F7Ee0295c4616cF22";
var userAddress = null;

function init() {
  if (typeof web3 !== 'undefined') {
    // We have web3

    web3 = new Web3(web3.currentProvider);

    var title = null;
    var summary=null;
    var transactionCount=null;
    var gasPrice=null;
    showBuy = false;

    if (web3.eth.accounts.length == 0) {
      $("#no-accounts-msg").css('display', 'block');
    } else {
      // MetaMask is fully loaded

      /* --------- determine page title ------------- */
      if (userAddress == null) {
        // Check if this is the home feed page or a search result

        userAddress = web3.eth.coinbase;
        title = '<h1>Your Timeline (<a href="https://etherscan.io/address/' + userAddress + '">' + userAddress.slice(0, 10) + '...</a>)</h1><hr>'

        new Promise((resolve,reject)=>{
          web3.eth.getBalance(userAddress, function(error, result){
            if(!error)
                resolve(summary= '<h1>Wallet Balance: '+result+'</h1>');
            else
                console.error(error);
        })
        }).then((result)=>{
          console.log(result)
          $('#pageSummary').append(result)
        })

        new Promise((resolve,reject)=>{
          web3.eth.getTransactionCount(userAddress,function(error,result){
            if(!error)
              resolve(transactionCount='<h1>No. of Transactions: '+result+' </h1>')
            else
              console.error(error)
          })
        }).then((result)=>{
          $('#pageTransactions').append(result)
        })

        new Promise((resolve,reject)=>{
            web3.eth.getGasPrice(function(error,result){
              if(!error)
                resolve(gasPrice= '<h1>Price of Gas: '+ result +'</h1>')
              else
                console.error(error)
            })
        }).then((result)=>{
          $('#gasPrices').append(result)
        })

      } else {
        showBuy = true;
        title = '<h1>Timeline for <a href="https://etherscan.io/address/' + userAddress + '">' + userAddress.slice(0, 10) + '...</a></h1><hr>'
        var summary= '<h1>hi</h1>'
      }

      $("#pageTitle").append(title)

      /* --------- app stuff ----------- */
      for (var i = 0; i < NFTControllers.length; i++) {
        NFTControllers[i].nftDisplay(userAddress)
      }

    }
  } else {
    // No Metamask
    $("#no-web3-msg").css('display', 'block');
  }
}


function contractOrUser(str) {
  if (web3.toHex(str) == 0x0) {
    return "Newly minted";
  } else if (!web3.isAddress(str)) {
    return str;
  } else {
    return '<a href="https://etherscan.io/address/' + str + '">' + str + '</a>';
  }
}

window.onload = function () {
  init();
}
