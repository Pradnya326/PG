var Migrations = artifacts.require("./Employee.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
