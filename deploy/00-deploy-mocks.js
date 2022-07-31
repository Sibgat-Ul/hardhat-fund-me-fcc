const { network } = require("hardhat");
const { developmentChains, DECIMALS, INITIAL_ANSWER } = require("../helper-hardhat-config");

module.exports = async ({getNamedAccounts, deployments}) => {
    console.log("Deploy mocks");
    hre.getNamedAccounts();
    hre.deployments;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    const chainId = network.config.chainId;

    if(developmentChains.includes(network.name)) {
        log("Local network!");
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER]
        })
        log("Mocks deployed!");
    }
}

module.exports.tags = ["all", "mocks"];