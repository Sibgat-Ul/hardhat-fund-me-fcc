//import
//main func
//call of main
//hre = hardhat runtime environment

const { networkConfig } = require("../helper-hardhat-config");
const { network } = require("hardhat")
const hre = require("hardhat");

async function deployFunc(hre) {
    console.log("Hi!");
    const { getNamedAccounts, deployments } = hre;

    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    let ethUsdPriceFeedAddress;
    if (chainId == 31337) {
      const ethUsdAggregator = await deployments.get("MockV3Aggregator");
      ethUsdPriceFeedAddress = ethUsdAggregator.address;
    } else {
      ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    }
    log("----------------------------------------------------");
    log("Deploying FundMe and waiting for confirmations...");
    const fundMe = await deploy("FundMe", {
      from: deployer,
      args: [ethUsdPriceFeedAddress],
      log: true,
      // we need to wait if on a live network so we can verify properly
      waitConfirmations: network.config.blockConfirmations || 1,
    });
    log(`FundMe deployed at ${fundMe.address}`);
}

module.exports.default = deployFunc(hre);
module.exports.tag = ["all"]