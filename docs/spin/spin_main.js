window.onload = () => {
  $(".container")
    .hide(10)
    .fadeIn(1000, function() {
      //Stuff to do *after* the animation takes place
    });

  let btn = document.querySelector("button");

  function onComplete(active) {}

  btn.addEventListener("click", () => {
    wheelSound.play();
    setTimeout(() => machine1.shuffle(40, onComplete, randomize), 1000);
    setTimeout(() => machine2.shuffle(45, onComplete, randomize), 1500);
    setTimeout(() => machine3.shuffle(52, onComplete, randomize), 2000);
    setTimeout(() => stopAudio(wheelSound), 12000);
    setTimeout(() => mint(), 12000);
  });

  var contract = null;
  var abi = null;
  var contractAddress = "0xf75449c311af9ae61207fa9c8c35aed30b0871a8";
  var account = null;

  if (typeof web3 !== "undefined") {
    web3 = new Web3(web3.currentProvider);
  } else {
    console.log("Else");
    // set the provider you want from Web3.providers
    var web3Provider = new web3.providers.HttpProvider("http://127.0.0.1:7545");
    web3 = new Web3(web3Provider);

    //Here we create the confirmation and ebooks URLs and construct the links
    var metamaskURL =
      "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn";
    var metamaskLink =
      "<a style='text-decoration: none; border-bottom: 1px solid #8bacb9; color: #8bacb9;' target= '_blank' href=' " +
      metamaskURL +
      " ' >Chrome Web Store</a> ";
    // Update the note about metamask
    var metamaskElement = document.getElementById("metamask");
    var metamaskNoMetamaskElement = document
      .getElementById("metamask")
      .getElementsByClassName("status noMetamask")[0];
    metamaskNoMetamaskElement.querySelector(".note").innerHTML =
      "To download Metamask, head to the " +
      metamaskLink +
      ". Once downloaded create an account and store the seed phrase. After, you can retrieve your token.";
    //document.getElementById('getTokenButton').style.visibility='hidden';
    metamaskElement.style.visibility = "visible";
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

    contract.mintTo(
      account,
      "https://www.alicetoken.com/api/1",
      { from: account, gas: 250000 },
      (err, result) => {
        if (result) {
          //Here we create the confirmation and ebooks URLs and construct the links
          var confirmationURL = "https://etherscan.io/tx/" + result;
          var confirmationLink =
            "<a style='text-decoration: none; border-bottom: 1px solid #8bacb9; color: #8bacb9;' target= '_blank' href=' " +
            confirmationURL +
            " ' >transaction</a> ";

          const ebookURL =
            "https://ipfs.io" +
            "/ipfs/QmVKEC8HSxhwLZ7tfrkrbQuaKVyyUvRUZxDq3XDApPbZUj";
          const ebookLink =
            "<a style='text-decoration: none; border-bottom: 1px solid #8bacb9; color: #8bacb9;' target= '_blank' href=' " +
            ebookURL +
            " ' >ebook</a> ";

          // var link = document.createElement("a");
          // link.href = "https://ropsten.etherscan.io/tx/";
          // link.target = "_blank";
          // link.appendChild(document.createTextNode("transaction"));
          // confirmationElement.querySelector('.note').appendChild(link);

          // Update the note about the token and the ebook
          var confirmationElement = document.getElementById("confirmation");
          var confirmationSuccessElement = document
            .getElementById("confirmation")
            .getElementsByClassName("status success")[0];

          // Here we show the consfirmation message
          $(".status.success")
            .slideDown(500, function() {
              //Stuff to do *after* the animation takes place
            })
            .delay(10000)
            .slideUp(1500, function() {
              //Stuff to do *after* the animation takes place
            });
          console.log("Success you have bought the coin!");
        } else {
          //Here we show the error message
          console.log("Denied");
          $(".status.error")
            .slideDown(500, function() {
              //Stuff to do *after* the animation takes place
            })
            .delay(10000)
            .slideUp(1500, function() {
              //Stuff to do *after* the animation takes place
            });
        }
        console.log(err ? err : result);
      }
    );

    // Here we hide the button after minting the token.
    //document.getElementById('getToken').style.visibility='hidden';
  }

  function getTokens() {
    var account = web3.eth.accounts[0];

    contract.tokenOfOwnerByIndex.call(account, 0, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }

      console.log(result.valueOf());
    });
  }

  loadABI().then(a => {
    contract = web3.eth.contract(abi).at(contractAddress);
    if (contract !== null) {
      console.log("Log the contract on next line: ");
      console.log(contract);
      console.log("Contract has been loaded");
    }
    getTokens();
  });
};
