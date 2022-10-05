const { ethers } = require("hardhat")

const networkConfig = {
    default: {
        name: "hardhat",
        interval: "30",
    },
    4: {
        name: "rinkeby",
        interval: "30",
    },
    31337: {
        name: "localhost",
        interval: "30",
    },
}

const INITIAL_SUPPLY = "1000000000000000000000000"

developmentChains = ["hardhat", "localhost"]

module.exports = { networkConfig, developmentChains, INITIAL_SUPPLY }
