//import
//main func
//call of main
//hre = hardhat runtime environment
/*
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
module.exports.tag = ["all"]*/
const { network } = require("hardhat");
const { developmentChains, networkConfig } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify.js");

module.exports = async ({ getNamedAccounts, deployments}) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  let ethUsdPriceFeedAddress;

  if(developmentChains.includes(network.name)) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUSDPriceFeed"]
  }

  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [
      ethUsdPriceFeedAddress
    ],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })

  if(!developmentChains.includes(network.name) && process.env.ETH_SCAN_API) {
    await verify(fundMe.address, ethUsdPriceFeedAddress);
  }
}

module.exports.tags = ["all", "fundme"]
