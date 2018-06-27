window.onload = () => {

  $('.landingPage').hide(10).fadeIn(2000, function() {
    //Stuff to do *after* the animation takes place
  })
  $('button').hide(10).slideDown(600, function() {
    //Stuff to do *after* the animation takes place
  })

  let button = document.querySelector('button');
  button.addEventListener('click', () => {
    mint();
  });

  var contract = null;
  var abi = null;
  var contractAddress = "0x819dfBf2413771B7266d602714135939D823c24B";
  var account = null;

  if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
  } else {
    console.log("Else");
    // set the provider you want from Web3.providers
    var web3Provider = new web3.providers.HttpProvider('http://127.0.0.1:7545');
    web3 = new Web3(web3Provider);

    //Here we create the confirmation and ebooks URLs and construct the links
    var metamaskURL = "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn";
    var metamaskLink = "<a style='text-decoration: none; border-bottom: 1px solid #8bacb9; color: #8bacb9;' target= '_blank' href=' " + metamaskURL + " ' >Chrome Web Store</a> ";
      // Update the note about metamask
    var metamaskElement = document.getElementById('metamask');
    var metamaskNoMetamaskElement = document.getElementById('metamask').getElementsByClassName("status noMetamask")[0];
    metamaskNoMetamaskElement.querySelector('.note').innerHTML =
    'To download Metamask, head to the ' + metamaskLink +
    '. Once downloaded create an account and store the seed phrase. After, you can retrieve your token.';
    //document.getElementById('getTokenButton').style.visibility='hidden';
    metamaskElement.style.visibility = 'visible';
    metamaskElement.style.opacity = 1;
    metamaskNoMetamaskElement.style.display = "flex";
  }

  function loadABI() {
    return new Promise(function(resolve, reject) {
      fetch("./build/contracts/VacationMood.json")
      .then(r => r.json())
      .then(json => {
        abi = json.abi;
        resolve(abi);
      });
    });
  }

  function mint() {
    var account = web3.eth.accounts[0];

    contract.mintTo(account, "https://www.alicetoken.com/api/1",  {from: account, gas : 250000 }, (err, result) => {

        if(result){

          //Here we create the confirmation and ebooks URLs and construct the links
          var confirmationURL = "https://etherscan.io/tx/" + result;
          var confirmationLink = "<a style='text-decoration: none; border-bottom: 1px solid #8bacb9; color: #8bacb9;' target= '_blank' href=' " + confirmationURL + " ' >transaction</a> ";

          const ebookURL = "https://ipfs.io" + '/ipfs/QmVKEC8HSxhwLZ7tfrkrbQuaKVyyUvRUZxDq3XDApPbZUj';
          const ebookLink = "<a style='text-decoration: none; border-bottom: 1px solid #8bacb9; color: #8bacb9;' target= '_blank' href=' " + ebookURL + " ' >ebook</a> ";

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
          console.log("Success you have bought the coin!");
        }

        else {
          //Here we show the error message
          var confirmationElement = document.getElementById('confirmation');
          var confirmationErrorElement = document.getElementById('confirmation').getElementsByClassName("status error")[0];
          confirmationElement.style.opacity = 1;
          confirmationElement.style.visibility = 'visible';
          confirmationErrorElement.style.display = "inLine";
          confirmationErrorElement.style.width = 'auto';
          confirmationErrorElement.style.height = 'auto';
          confirmationErrorElement.style.margin = '0px 0px 1200px 0px';
        }
        console.log(err ? err : result);

    });

    // Here we hide the button after minting the token.
    //document.getElementById('getToken').style.visibility='hidden';
}

  function getTokens() {
    var account = web3.eth.accounts[0];

    contract.tokenOfOwnerByIndex.call(account, 0, (err, result) => {
      if(err) {
        console.log(err);
        return;
      }

      console.log(result.valueOf());
    });
  }

  loadABI().then(a => {
    contract = web3.eth.contract(abi).at(contractAddress);
    if(contract !== null){
      console.log("Log the contract on next line: ");
      console.log(contract);
      console.log("Contract has been loaded");
    }
    getTokens();
  });

}
