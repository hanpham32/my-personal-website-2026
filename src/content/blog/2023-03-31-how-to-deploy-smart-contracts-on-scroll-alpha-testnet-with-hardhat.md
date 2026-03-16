---
title: "How to deploy smart contracts on Scroll Alpha Testnet with Hardhat"
date: "2023-03-31"
---

Scroll makes it easy to start building on their zkEVM Layer-2 network. You can start deploying your existing Solidity smart contracts to their Alpha Testnet.

This post provides guidance and steps in deploying your smart contracts on Scroll Alpha Testnet.

Create a .env file in your root folder and configure your .env file as follows:

```
# .env

SCROLL_TESTNET_URL = "https://alpha-rpc.scroll.io/l2"
PRIVATE_KEY = "YOUR-PRIVATE-KEY"
```

If you use Metamask, you can find your wallet key within your Metamask interface. To find your wallet private key, log into your MetaMask account, click the Details button on your Main Ethereum Network page, and then click the Export Private Key button.

More information about their Alpha Testnet and RPC URL info can be found here

Next, configure your hardhat.config.ts file:

```


// file: hardhat.config.ts
import \* as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

dotenv.config();

const config: HardhatUserConfig = {
solidity: "0.8.18", // here I use solidity version 0.8.^, but you can change to your current solidity version
networks: {
scrollTestnet: {
url: process.env.SCROLL_TESTNET_URL || "",
accounts:
process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY]: [],
}
}
};

export default config;
```

Before deployment, you should load your test tokens on Alpha Testnet so you can execute the transactions. You can transfer your test tokens from Goerli Testnet to Scroll Alpha using Scroll Bridge

Make sure your smart contracts are compiled. Here are the command lines to deploy with npm:

```
npx hardhat compile
npx hardhat run --network scrollTestnet

```

If your deployment has been successful, you will see something like this in your console:

```
deployd to 0xEeD1...
✨ Done in 7.86s.
```

Additionally, you can find your deployed smart contracts on their block explorer here:

[Scroll Alpha Testnet Explorer](https://blockscout.scroll.io/)

Thanks for reading. Hope this guide was useful.
