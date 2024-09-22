const ethers = require("ethers");

require("dotenv").config();
const express = require("express");
const { contractABI } = require("../contract");
const User = require("../models/User"); // Adjust the path as needed
const { parseEther } = require("viem");

const router = express.Router();

router.get("/example", async (req, res) => {
  let a = await new User({ address: "1" }).save();
  res.status(200).json({ message: "Hello, world!" });
});
router.post("/claimAccount", async (req, res) => {
  const { username } = req.body;
  let oldUser = await User.findOne({ username });
  if (oldUser) {
    res.status(200).json(oldUser);
  } else {
    const document = await User.findOne({ isClaimed: { $exists: false } });
    document.username = username;
    document.isClaimed = true;
    let result = await document.save();
    res.status(200).json(result);
  }
});
router.post("/createMarket", async (req, res) => {
  const { description } = req.body;
  const privateKey = process.env.ADMIN_PRIVATE_KEY;
  const contractAddress = process.env.CONTRACT;

  const provider = new ethers.JsonRpcProvider(process.env.FLOW_RPC_URL);
  const wallet = new ethers.Wallet(privateKey, provider);

  // Connect to the PollyMarket contract
  const contract = new ethers.Contract(contractAddress, contractABI, wallet);

  try {
    // Create the market
    const expirationDate = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30 days from now
    const tx = await contract.createMarket(description, expirationDate);

    console.log("Transaction sent:", tx.hash);

    const receipt = await tx.wait();

    console.log("Market created successfully! ");
    console.log("Transaction receipt:", receipt);
    res.status(200).json({ message: receipt });
  } catch (error) {
    console.error("Error creating market:", error);
    res.status(200).json({ message: "Error" });
  }
});

router.post("/placeBet", async (req, res) => {
  const { username, amount, inFavour, marketId } = req.body;
  const privateKey = process.env.ADMIN_PRIVATE_KEY;
  const contractAddress = process.env.CONTRACT;
  console.log(contractAddress);
  let user = await User.findOne({ username });
  console.log(user);
  const provider = new ethers.JsonRpcProvider(process.env.FLOW_RPC_URL);
  const wallet = new ethers.Wallet(privateKey, provider);

  // Connect to the PollyMarket contract
  const contract = new ethers.Contract(contractAddress, contractABI, wallet);

  try {
    const tx = await contract.placeBet(
      BigInt(marketId),
      inFavour,
      parseEther(amount)
    );
    const receipt = await tx.wait();
    console.log("Market created successfully! ");
    console.log("Transaction receipt:", tx);
    res.status(200).json({ message: tx });
  } catch (error) {
    console.error("Error creating market:", error);
    res.status(200).json({ message: "Error" });
  }
});
router.post("/resolveMarket", async (req, res) => {
  const { marketId, outcome } = req.body;
  const contractAddress = process.env.CONTRACT;
  const privateKey = process.env.ADMIN_PRIVATE_KEY;
  const provider = new ethers.JsonRpcProvider(process.env.FLOW_RPC_URL);
  const wallet = new ethers.Wallet(privateKey, provider);

  // Connect to the PollyMarket contract
  const contract = new ethers.Contract(contractAddress, contractABI, wallet);

  try {
    const tx = await contract.resolveMarket(marketId, outcome);

    console.log("Transaction sent:", tx.hash);

    const receipt = await tx.wait();

    console.log("Market created successfully! ");
    console.log("Transaction receipt:", receipt);
    res.status(200).json({ message: receipt });
  } catch (error) {
    console.error("Error creating market:", error);
    res.status(200).json({ message: "Error" });
  }
});
router.post("/getMarketInfo", async (req, res) => {
  const { marketId } = req.body;
  const contractAddress = process.env.CONTRACT;
  const privateKey = process.env.ADMIN_PRIVATE_KEY;
  const provider = new ethers.JsonRpcProvider(process.env.FLOW_RPC_URL);
  const wallet = new ethers.Wallet(privateKey, provider);

  // Connect to the PollyMarket contract
  const contract = new ethers.Contract(contractAddress, contractABI, wallet);

  try {
    // Create the market

    const tx = await contract.getMarketInfo(marketId);

    console.log("Transaction sent:", tx);

    console.log("Market created successfully! ");
    const replacer = (key, value) =>
      typeof value === "bigint" ? value.toString() : value;

    res.status(200).json({ message: JSON.stringify(tx, replacer) });
  } catch (error) {
    console.error("Error creating market:", error);
    res.status(200).json({ message: "Error" });
  }
});
router.get("/getAllMarketInfo", async (req, res) => {
  try {
    const contractAddress = process.env.CONTRACT;
    const privateKey = process.env.ADMIN_PRIVATE_KEY;
    const provider = new ethers.JsonRpcProvider(process.env.FLOW_RPC_URL);
    const wallet = new ethers.Wallet(privateKey, provider);

    // Connect to the PollyMarket contract
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    const tx = await contract.getAllMarkets();
    const replacer = (key, value) =>
      typeof value === "bigint" ? value.toString() : value;
    let rtx = JSON.stringify(tx, replacer);
    console.log("Transaction sent:", rtx);
    let arr = JSON.parse(rtx);
    console.log(arr[0].length);
    let resultArr = [];
    for (var i = 0; i < arr[0].length; i++) {
      resultArr.push({
        title: arr[0][i],
        date: arr[1][i],
        totalYesAmounts: arr[2][i],
        totalNoAmounts: arr[3][i],
      });
    }
    console.log(resultArr);

    return res.status(200).json({ data: JSON.stringify(resultArr, replacer) });
  } catch (error) {
    console.error("Error creating market:", error);
    return res.status(200).json({
      message: "Error",
      data: [
        {
          id: 1,
          title: "Will Bitcoin reach $100k by end of 2025?",
          optionA: "Yes",
          optionB: "No",
          percentageA: 65,
          percentageB: 35,
          totalBet: 10000,
        },
        {
          id: 2,
          title: "Will Trump win the 2024 presidential election?",
          optionA: "Yes",
          optionB: "No",
          percentageA: 80,
          percentageB: 20,
          totalBet: 5000,
        },
        {
          id: 3,
          title: "Will FC Barcelona win La Liga?",
          optionA: "Yes",
          optionB: "No",
          percentageA: 40,
          percentageB: 60,
          totalBet: 5000,
        },
        {
          id: 4,
          title: "Will Trump win the 2024 presidential election?",
          optionA: "Yes",
          optionB: "No",
          percentageA: 80,
          percentageB: 20,
          totalBet: 5000,
        },
        // Add more mock markets as needed
      ],
    });
  }
});

module.exports = router;
