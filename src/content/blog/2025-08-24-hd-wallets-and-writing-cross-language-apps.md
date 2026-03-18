---
title: "HD Wallets and writing cross-language apps"
date: "2025-08-24"
---

When I think of HD, I think of video resolutions, like the 1080p which refers to how many pixels are being rendered on screen per second. But in the context of blockchain, HD refers to Hierarchical Deterministic Wallets.

Until now, I never fully understand how a wallet that is used to interact with blockchain networks works. I only know that when I create a new wallet, I will be given a special several words long that is called a seed phrase; and the seed phrase must never be revealed.

Terms:

> **Hierarchical**: the keys' relationship is organized into a tree structure.
>
> **Deterministic**: the keys are guaranteed to be generated in the same way.

So an HD wallet is a wallet that can generate all of its key in a hierarchical and deterministic manner given a _single source_. This practice is followed by the [BIP32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki).

> BIP32: defines the standard how to generate a tree of keys.

And that single source is the master seed, which was proposed and standardized in the [BIP39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki).

> BIP39: defines the standard how to generate a seed.

From that seed, the wallet uses a mathematical formula to **deterministically** derive an unlimited amount of key pairs.

This makes the seed the most important thing to never be revealed!

In comparison to the original, or basic, wallet, there is no way to keep track of all the key pairs that have been generated. You can be using the same key pair every time, but doing that would compromise your identity on the network because your transactions are public and people can backtrack your transaction activities. Whereas in a HD wallet, creating a new key pair is safe because you don't have to back it up-- it's mathematically deterministic.

BIP39 was defined for Bitcoin, but gradually was widely adopted by many blockchains (e.g. Ethereum, Solana, etc). And because the BIP39 standard is widely being used across crypto ecosystem, it makes your wallet interoperable. But the caveat is that the way the wallet derivation may not be the same across different chains!

This was the problem I faced with when writing the code for wallet generation in both Rust and Go. I was very confused why different key pairs were generated given the same seed phrase. In Rust, the most common library used to derive an Ethereum wallet is `alloy`, and a Solana wallet is `solana_sdk`. In Go, there is no library that is officially supported for a specific chain yet, so using a library like `go-ethereum-hdwallet`, you'd need to specify the derivation path (for ethereum it's `m/44'/60'/0'/0/0`).
