const Cryptle = artifacts.require("./Cryptle.sol");

module.exports = async function(deployer) {
    deployer.deploy(Cryptle);
}
