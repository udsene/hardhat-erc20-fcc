const {developmentChains, networkConfig, INITIAL_SUPPLY} = require("../../helper-hardhat-config")
const {deployments, getNamedAccounts, ethers, network } = require("hardhat")
const {assert, expect} = require("chai")

!developmentChains.includes(network.name) ? describe.skip : describe("OurToken Unit Tests", function(){
    //const chainId = network.config.chainId
    const multiplier = 10**18
    let ourToken, deployer, user1
    beforeEach(async function(){
        const accounts = await getNamedAccounts() 
        deployer = accounts.deployer
        user1 = accounts.user1
        await deployments.fixture(["all"])
        ourToken = await ethers.getContract("OurToken", deployer)
    })
    it("was deployed", async function(){
        assert(ourToken.address)
    })

    describe("constructor", function() {
        it("Initializes the ourtoken correctly", async function(){
            const totalSupply = await ourToken.totalSupply()
            assert.equal(totalSupply.toString(), INITIAL_SUPPLY)
        })
        it("initializes the ourtoken with token name and symbol", async function(){
            const tokenName = (await ourToken.name()).toString()
            const tokenSymbol = await ourToken.symbol()
            assert.equal(tokenName, "Our Token")
            assert.equal(tokenSymbol.toString(), "OT")
        })
    })
    describe("transfers", ()=>{
        it("Should be able to transfer tokens succesfully to an address", async ()=>{
            const tokensToSend = await ethers.utils.parseEther("10")
            await ourToken.transfer(user1, tokensToSend)
            expect(await ourToken.balanceOf(user1)).to.equal(tokensToSend)
        })
        it("emits a tranfer event, when a transfer occurs", async () => {
            await expect(ourToken.transfer(user1, (10 * multiplier).toString())).to.emit(ourToken, "Transfer")
        })
    })
    describe("allowances", () => {
        const amount = (20 * multiplier).toString()
        beforeEach(async ()=>{
            playerToken = await ethers.getContract("OurToken", user1 )
        })
        it("Should approve other token to spend token", async () => {
            const tokensToSpend = await ethers.utils.parseEther("5")
            await ourToken.approve(user1, tokensToSpend)
            ourToken1 = await ethers.getContract("OurToken", user1)            
            await ourToken1.transferFrom(deployer, user1, tokensToSpend)
            expect(await ourToken1.balanceOf(user1)).to.equal(tokensToSpend)
        })
        it("dosen't allow an unapproved member to do transfers", async () => {
            await expect(playerToken.transferFrom(deployer, user1, amount)).to.be.revertedWith("ERC20: insufficient allowance")
        })
        it("emits an approval event, when an approval occurs", async () => {
            await expect(ourToken.approve(user1, amount)).to.emit(ourToken, "Approval")
        })
        it("the allowance being set is accurate", async () => {
            await ourToken.approve(user1, amount)
            const allowance = await ourToken.allowance(deployer, user1)
            assert.equal(allowance.toString(), amount)
            //expect(allowance.toString()).to.equal(amount)
        })
        it("Won't allow a user to go over the allowance", async () => {
            const transferAmount = (30 * multiplier).toString()
            await ourToken.approve(user1, amount)
            await expect(playerToken.transferFrom(deployer, user1, transferAmount)).to.be.revertedWith("ERC20: insufficient allowance")
        })
    })
})