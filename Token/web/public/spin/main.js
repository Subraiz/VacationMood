
var contract = null;
var abi = null;
var contractAddress = "0x4de397226ecf480d7ea1873f7ee0295c4616cf22";
var account = null;


function init() {

    // Is there is an injected web3 instance?
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
      // If no injected web3 instance is detected, fallback to Ganache.
      var web3Provider = new web3.providers.HttpProvider('http://127.0.0.1:7545');
      web3 = new Web3(web3Provider);

      //Here we create the notification that no web3 instance has been detected
      var metamaskURL = "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn";
      var metamaskLink = "<a style='text-decoration: none; border-bottom: 1px solid #e5b572; color: #e5b572;' target= '_blank' href=' " + metamaskURL + " ' >Chrome Web Store</a> ";

      // Update the note about metamask
      var metamaskElement = document.getElementById('metamask');
      var metamaskNoMetamaskElement = document.getElementById('metamask').getElementsByClassName("status noMetamask")[0];
      metamaskNoMetamaskElement.querySelector('.note').innerHTML =
      'To download Metamask, head to the ' + metamaskLink +
      '. Once downloaded create an account and store the seed phrase. After that, you can retrieve your token.';

      document.getElementById('getTokenButton').style.visibility='hidden';
      metamaskElement.style.visibility = 'visible';
      metamaskElement.style.opacity = 1;
      metamaskNoMetamaskElement.style.display = "flex";
    }

    // Check the connection
    if(!web3.isConnected()) {
      console.error("Not connected");
    }

   loadABI().then(a => {
        contract = web3.eth.contract(abi).at(contractAddress);
        console.log("Loaded contract...");

        getTokens();
   });
}

function loadABI() {
    return new Promise(function(resolve, reject) {
        fetch("./contracts/AliceInWonderland.json")
        .then(r => r.json())
        .then(json => {
            abi = json.abi;
            resolve(abi);
        });
    });
}


function mint() {
  var account = web3.eth.accounts[0];

  const randomQuantity = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  const quantity = randomQuantity(2, 6);
  var tokenURI = "https://www.alicetoken.com/api/" + quantity;

  var tokenImages = ["bluetoken2", "cardstoken", "cookietoken", "cuptoken", "watchtoken"];

  this.contract.mintTo(account, tokenURI,  {from: account, gas : 250000 }, (err, result) => {

      if(result){

        //Here we create the confirmation and ebooks URLs and construct the links
        var confirmationURL = "https://etherscan.io/tx/" + result;
        var confirmationLink = "<a style='text-decoration: none; border-bottom: 1px solid #e5b572; color: #e5b572;' target= '_blank' href=' " + confirmationURL + " ' >transaction</a> ";

        const ebookURL = "https://ipfs.io" + '/ipfs/QmVKEC8HSxhwLZ7tfrkrbQuaKVyyUvRUZxDq3XDApPbZUj';
        const ebookLink = "<a style='text-decoration: none; border-bottom: 1px solid #e5b572; color: #e5b572;' target= '_blank' href=' " + ebookURL + " '>ebook</a> ";

        // var link = document.createElement("a");
        // link.href = "https://ropsten.etherscan.io/tx/";
        // link.target = "_blank";
        // link.appendChild(document.createTextNode("transaction"));
        // confirmationElement.querySelector('.note').appendChild(link);

        // Update the note about the token and the ebook
        var confirmationElement = document.getElementById('confirmation');
        var confirmationSuccessElement = document.getElementById('confirmation').getElementsByClassName("status success")[0];
        confirmationElement.querySelector('.note').innerHTML =
        'We just sent it to your address, please look at your ' + confirmationLink +
        ' and download the ' + ebookLink + '.';

        // Here we show the consfirmation message
        confirmationElement.style.opacity = 1;
        confirmationElement.style.visibility = 'visible';
        confirmationSuccessElement.style.display = "flex";
        confirmationSucessElement.style.width = 'auto';
        confirmationSucessElement.style.height = 'auto';
        confirmationSucessElement.style.margin = 'auto';
        confirmationSuccessElement.style.background = '#777f91 url(/images/'+tokenImages[quantity-2]+'.png) no-repeat';
        confirmationErrorElement.style.backgroundSize = '120px 140px';

      }

      else {
        //Here we show the error message
        var confirmationElement = document.getElementById('confirmation');
        var confirmationErrorElement = document.getElementById('confirmation').getElementsByClassName("status error")[0];

        confirmationElement.style.opacity = 1;
        confirmationElement.style.visibility = 'visible';
        confirmationErrorElement.style.display = "flex";
        confirmationErrorElement.style.width = 'auto';
        confirmationErrorElement.style.height = 'auto';
        confirmationErrorElement.style.margin = 'auto';
      }
      console.log(err ? err : result);

    });

    // Here we hide the button after minting the token.
    document.getElementById('getTokenButton').style.visibility='hidden';
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


window.onload = function () {
    init();
}
