var aliceInstance = null;
var aliceContract = "0x4de397226ECF480D7Ea1873F7Ee0295c4616cF22";
var userAddress = null;

function init() {
  if (typeof web3 !== 'undefined') {
    // We have web3

    web3 = new Web3(web3.currentProvider);

    var title = null;
    var saveButton = null;
    var summary=null;
    var transactionCount=null;
    var gasPrice=null;
    showBuy = false;

    if (web3.eth.accounts.length == 0) {
      $("#no-accounts-msg").css('display', 'block');
    } else {
      // MetaMask is fully loaded
      $.post( "/login", { eth_account: web3.eth.coinbase } ).done(function(data) {
        console.log(data);
        console.log(data.uuid);
        if (data.redirect) {
          console.log("redirecting...")
          window.location = data.redirect;
        }
      });

      /* --------- determine page title ------------- */
      if (userAddress == null) {
        // Check if this is the user's feed page or an address result

        userAddress = web3.eth.coinbase;
        title = '<h1>Your Timeline (<a href="https://etherscan.io/address/' + userAddress + '">' + userAddress.slice(0, 10) + '...</a>)</h1>'
      } else {
        // Not user's personal feed
        showBuy = true;
        title = '<h1>Timeline for <a href="https://etherscan.io/address/' + userAddress + '">' + userAddress.slice(0, 10) + '...</a></h1>';

        saveButton = '<button type="button" id="saveButton" class="btn btn-sm btn-success" style="width: 50px; margin-top: 0px;">+</button>';
        // var summary = '<h1>hi</h1>'
      }
      /* --------- app stuff ----------- */

      /* Add page title + summary stuff */
      $("#text-title").append(title);
      $("#text-title").append(saveButton);
      new Promise((resolve,reject)=>{
        web3.eth.getBalance(userAddress, function(error, result){
          if(!error)
          resolve(summary= '<p><span style="font-weight: bold;">Balance</span>: ' + web3.fromWei(result, 'ether').toString().slice(0, 8) + ' ETH</p>');
          else
          console.error(error);
        })
      }).then((result)=>{
        $('#eth-balance').append(result)
      })

      new Promise((resolve,reject)=>{
        web3.eth.getTransactionCount(userAddress,function(error,result){
          if(!error)
          resolve(transactionCount='<p><span style="font-weight: bold;">Transactions</span>: '+result+' </p>')
          else
          console.error(error)
        })
      }).then((result)=>{
        $('#num-transactions').append(result)
      })

      new Promise((resolve,reject)=>{
        web3.eth.getGasPrice(function(error,result){
          if(!error)
          resolve(gasPrice= '<p><span style="font-weight: bold;">Gas Price</span>: '+ result +' WEI</p>')
          else
          console.error(error)
        })
      }).then((result)=>{
        $('#gas-prices').append(result)
      })
      /* ----------------------------------- */
      if (userBookmarks) {
        console.log("Pre-defined bookmark, ", userBookmarks)
        for (var i = 0; i < userBookmarks.length; i++) {
          // TO-DO: Don't add if already exists
          $("#saved_addresses ul").append(getBookmarkTemplate(userBookmarks[i]));
        }
      } else {
        $.getJSON("/getBookmarks", function(result) {
          console.log("attempting to fetch bookmarks...", result);
          if (result.bookmarks) {
            var saved = result.bookmarks;
            for (var i = 0; i < saved.length; i++) {
              $("#saved_addresses ul").append(getBookmarkTemplate(saved[i]));
            }
          }
        })
      }

      var balancePromises = [];
      for (var i = 0; i < NFTControllers.length; i++) {
        balancePromises.push(NFTControllers[i].nftBalance(userAddress));
      }

      Promise.all(balancePromises).then(all_balances => {
        for (var i = 0; i < all_balances.length; i++) {
          // Check all token balances and only attempt to display tokens you actually have...
          if (all_balances[i] > 0) {
            $("#tokens").append('<p><span style="font-weight: bold;">'  + NFTControllers[i].nftName + '</span>: ' + all_balances[i] + "</p>")
            NFTControllers[i].nftDisplay(userAddress);
          }
        }
      })
    }
  } else {
    // No Metamask
    $("#no-web3-msg").css('display', 'block');
  }

  $("#saveButton").click(function() {
    $.post("/addBookmark", {eth_save: userAddress});
    $("#saved_addresses ul").append(getBookmarkTemplate(userAddress));
  })
}

function getBookmarkTemplate(bookmark) {
  var item = `
  <li>
    <a href='https://etherscan.io/address/` + bookmark + `'>` + bookmark.slice(0, 10) + `...</a>
    &nbsp;&nbsp;&nbsp;<span id="del-bookmark"></span>
  </li>
  `
  return item;
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
