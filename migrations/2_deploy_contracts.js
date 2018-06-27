var ConvertLib = artifacts.require("./ConvertLib.sol");
var VacationMood = artifacts.require("./VacationMood.sol");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, VacationMood);
  deployer.deploy(VacationMood, {gas: 5000000});
};
