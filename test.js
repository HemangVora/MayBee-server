const ethers = require("ethers");
const { parseUnits, parseEther, formatEther } = require("viem");
require("dotenv").config();

// ABI of the PollyMarket contract (you'll need to replace this with the actual ABI)
const contractABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_expirationDate",
        type: "uint256",
      },
    ],
    name: "createMarket",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_marketId",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_isYes",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "placeBet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_marketId",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_outcome",
        type: "bool",
      },
    ],
    name: "resolveMarket",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_marketId",
        type: "uint256",
      },
    ],
    name: "claimRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_marketId",
        type: "uint256",
      },
    ],
    name: "getMarketInfo",
    outputs: [
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "expirationDate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "yesShares",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "noShares",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isResolved",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "outcome",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_marketId",
        type: "uint256",
      },
    ],
    name: "userYesShares",
    outputs: [
      {
        internalType: "mapping(address => uint256)",
        name: "",
        type: "mapping",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_marketId",
        type: "uint256",
      },
    ],
    name: "userNoShares",
    outputs: [
      {
        internalType: "mapping(address => uint256)",
        name: "",
        type: "mapping",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "marketCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "marketId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "expirationDate",
        type: "uint256",
      },
    ],
    name: "MarketCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "marketId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "bool",
        name: "isYes",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "BetPlaced",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "marketId",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "outcome",
        type: "bool",
      },
    ],
    name: "MarketResolved",
    type: "event",
  },
];

// Address of the deployed PollyMarket contract
const contractAddress = "0xe8ccDc33D879AA5C2CE85E4c67fd61f857f6E329"; // Replace with your contract address

async function createMarket(description, expirationDate) {
  // Connect to the Ethereum network
  const provider = new ethers.JsonRpcProvider(process.env.FLOW_RPC_URL);

  // Load the admin's wallet
  const privateKey = process.env.ADMIN_PRIVATE_KEY;
  const wallet = new ethers.Wallet(
    "0xcf258e8af842a5ad3d9b3ee20c700a50f0c4de595bf3fef8e3ae1feeaa150923",
    provider
  );

  // Connect to the PollyMarket contract
  const contract = new ethers.Contract(contractAddress, contractABI, wallet);

  try {
    // Create the market
    const tx = await contract.getMarketInfo(1);
    // getMarketInfo(1, contract);
    // console.log("Transaction sent:", tx.hash);
    // Wait for the transaction to be mined
    // const receipt = await tx.wait();
    console.log(tx);
    console.log("Market created successfully!", tx[2] + "".split("n")[0]);
    // console.log("Transaction receipt:", receipt);
  } catch (error) {
    console.error("Error creating market:", error);
  }
}
// 5. **Place Bet**
async function placeBet(marketId, isYes, amountInEth) {
  try {
    const tx = await contract.placeBet(marketId, isYes, {
      value: parseUnits(amountInEth),
    });
    await waitForTransaction(tx);
    console.log(
      `Bet placed on market ${marketId} for ${
        isYes ? "Yes" : "No"
      } with ${amountInEth} ETH`
    );
  } catch (error) {
    console.error(`Error placing bet: ${error}`);
  }
}
// 8. **Get Market Info**
async function getMarketInfo(marketId, contract) {
  try {
    const info = await contract.getMarketInfo(marketId);
    console.log(`Market Info:`, info);
  } catch (error) {
    console.error(`Error getting market info: ${error}`);
  }
}

// Example usage
const description = "Will candidate X win the election?";
const expirationDate = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30 days from now

createMarket(description, expirationDate);
