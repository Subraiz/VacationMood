var aliceInstance = null;
var aliceContract = "0x4de397226ECF480D7Ea1873F7Ee0295c4616cF22";
var userAddress = null;

function init() {

  // Is there is an injected web3 instance?
  if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
    console.log("Loaded MM!")

    var title = null;
    showBuy = false;

    if (web3.eth.accounts.length == 0) {
      $("#no-accounts-msg").css('display', 'block');
    } else {

      fetch("/external_erc721.json").then(response => {
        response.json().then(watchContracts => {
          // Get the JSON data on all cryptocollectible contracts to watch

          aliceABI = watchContracts['Tokens'][0]['abi'];

          aliceInstance = web3.eth.contract(aliceABI).at(aliceContract);

          aliceInstance.tokenURI(tokenID, function(err, res) {
            var metadataURL = res;

            fetch(metadataURL).then(res => {
              // console.log("GOT URL", res);
              return res.json();
            }).then(json => {
              console.log("GOT JSON", json);

              var domImg = document.getElementById('tokenThumb-1');
              domImg.src = json.image;

              var domName = document.getElementById('tokenName-1');
              domName.innerHTML = json.name;

              var domDesc = document.getElementById('tokenDesc-1');
              domDesc.innerHTML = json.description;
            })
          });

        })
      });



    }

  } else {
    // No Metamask
    $("#no-web3-msg").css('display', 'block');
  }
}

function addTimelineCard(ev, tokenData) {
  if (ev['event'] == "Transfer") {
    var buyButton = ``;
    if (showBuy) {
      buyButton = `<button type="button" class="btn btn-primary">Buy/Bid</button>`
    }
    return `<div class="row transaction">
    <div class="col-md-2 txn-thumb-col d-flex flex-column justify-content-center align-items-center">
    <div style="width: 100%; max-height: 200px;">
    <a href="/tokens/` + ev.args._tokenId + `"><img class="card-img txn-thumb" id="" src="` + tokenData.image + `"></img></a>
    </div>`
    + buyButton +
    `</div>
    <div class="col-md">
    <div class="card-block" style="height: 100%;">
    <div class="card-body tokenBody d-flex flex-column">
    <h3 class="card-title" id="tokenName-1">Received <span class="tokenName">` + tokenData.name + `</span></h3>
    <p><b>from:</b> ` + contractOrUser(ev.args._from) + `
    <br>
    <b>tokenID:</b> ` + ev.args._tokenId.toNumber() + `
    <div class="flex-grow-1">
    </div>
    <small class="text-muted" style="word-wrap: break-word;"><a href="https://etherscan.io/tx/` + ev.transactionHash + `">tx: ` + ev.transactionHash.slice(0, 25) + `...</a></small>
    </div>
    </div>
    </div>
    </div>`;
  }
}

function contractOrUser(str) {
  if (web3.toHex(str) == 0x0) {
    return "Newly minted";
  } else {
    return '<a href="https://etherscan.io/address/' + str + '">' + str + '</a>';
  }
}

window.onload = function () {
  init();
}
