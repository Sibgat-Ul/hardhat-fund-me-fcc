const {deployments, ethers, getNamedAccounts} = require("hardhat");
const { assert, expect } = require("chai");

describe("FundMe", async function() {
    let fundme;
    let deployer;
    let mockV3Aggregator;
    let sendValue = ethers.utils.parseUnits("1");

    this.beforeEach(async () => {
        const accounts = await ethers.getSigners();
        const accountZero = accounts[0];

        deployer = (await getNamedAccounts()).deployer;
         
        await deployments.fixture(["all"]);
        fundme = await ethers.getContract("FundMe");
        mockV3Aggregator = await ethers.
            getContract("MockV3Aggregator",deployer);
    })

    describe("constructor", async function() {
        it("sets the aggregator address correctly", async function() {
           const response = await fundme.getPriceFeed();
           assert.equal(response, mockV3Aggregator.address);
        })
    })

    describe("fund", async function() {
        it("fails if you don't send enough Eth", async function () {
           await expect(fundme.fund()).to.be.rejectedWith(
            "You need to spend more ETH!"
           )
        })

        it("updat4e the amound funded data structure", async function() {
            await fundme.fund({ value: sendValue });
            const response = await fundme.getAddressToAmountFunded(deployer);
            assert.equal(response.toString(), sendValue.toString());
        })

        it("Adds funder to array of funders", async function() {
            await fundme.fund({value: sendValue});
            const funder = await fundme.getFunder(0);
            assert.equal(funder, deployer);
        })

        it("Only allow the owner to withdraw", async function () {
            const accounts = await ethers.getSigners();
            const attacker = accounts[1];
            const attackerConnectedContract = await fundme.connect(attacker);

            await expect(
              attackerConnectedContract.withdraw()
            ).to.be.revertedWithCustomError(fundme, "FundMe__NotOwner")
        })
    })

    
})