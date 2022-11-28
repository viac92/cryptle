const Cryptle = artifacts.require("./Cryptle.sol");
const BNBTest = artifacts.require("./BNBTest.sol");

module.exports = async function(deployer) {
    deployer.deploy(Cryptle);
    deployer.deploy(BNBTest, Cryptle.address);
}
