---
title: "UX Challenges with Crypto Wallet and Development of Account Abstraction"
date: "2023-05-23"
---

Blockchain technology allows us to transact and interact with digital assets and offers the properties of decentralization, security, and transparency. However, when it comes to User Experience (UX), crypto wallets present significant challenges to users. The management of private keys and seed phrases, the risk of losing access to accounts, and the absence of accounts recovery options have hindered the wide adoption of blockchain technology and created frustration even for experienced users. In response to these issues, the concept of Account Abstraction emerged as a solution to give wallet functionalities and improve the self-custody experience. By making wallets programmable, users can benefit from increased security measures, simplified account recovery methods, and additional flexibility to a wallet. In this blog, we will explore the UX problems associated with crypto wallets, the concept of Account Abstraction, and basic view of the flow of a Contract Account.

## Accounts in Ethereum

To interact with a blockchain network, a user needs to have a crypto wallet as an interface to transact, interact with smart contracts, or do any operation on the blockchain. On your wallet creation, you will be given a seed phrase (i.e. mnemonic seed), and public and private keys, which you will need to store and secure for access. Your wallet can be used to receive, send, and initiate transactions. And as the names imply, a public key is what you share and a private key is meant to be kept secret and secure. A private key must be kept secret because it is used to control your funds; it is what proves you to be the owner of the account. A seed phrase is a tool used to generate your public and private keys. It is the master key — one-way access to your account— and cannot be derived or reversed from a private or public key to restore your seed phrase, hence the name "seed" (root).

Problems arise when it comes to key management. Your wallet is not secured when someone can access your wallet with only one line of data. If someone gained access to your private key or seed phrase, your account and funds are compromised. In some cases, you can lose your private key and restore it with your seed phrase. However, the loss of the seed phrase means your account is compromised and is lost forever.

This type of account is also called an EOA (Externally Owned Account). In this type of account, you are considered a signer — a single owner of the account. Each account is associated with a signer, and a signer has a private and public key.

There are many ways that a person can lose their seed phrases, many of which are from lack of awareness to key management or human error. I have seen students participating in hackathons and losing access to their accounts on the same day of their account creation. From my personal experience, I have been in situations where I lost my seed phrase during the same hour I got my wallet because I forgot where I saved my seed phrase on my mobile device. I had to immediately create a new account and transfer my funds from the old one while I still had access.

## Summary of UX Problems

- If you lose your private key, you lose your account
- Private keys are hard to manage
- Logic to sign/verify transactions is hardcoded
- No account recovery

All of this shows that without proper knowledge of crypto wallets and tools to manage your own keys, your accounts and funds are at stake, even for experienced and long-time users.

## Concept of Account Abstraction and ERC 4337

Account Abstraction introduced the idea of Contract Account (CA) and is a solution proposed to tackle the limitations of EOA. Account Abstraction is the ability to make your wallet programmable. For a quick comparison between an Externally Owned Account and a Contract Account, an EOA is controlled by a private key and has no code, while a CA has no private key and is controlled by a smart contract and has code that is executed when interacting with an EOA. Moreover, your accounts can implement a different way to verify a transaction (e.g. biometric, authenticator service, etc.), or a different way to recover your account (e.g. link account to socials, additional backup keys, etc.)

Essentially, making an account programmable allows flexibility for features and implementations to a crypto wallet.

Followed by Account Abstraction, ERC 4337 is a milestone in the Ethereum community developed to achieve the goal of Account Abstraction. It aims to improve the self-custody experience for users to interact with the blockchain.

There are many ways we can implement account abstraction into our wallet experience and examples of those are:

- Multisig account (several signatures required for a transaction approval)
- Accounts with spending limits or application-specific accounts
- Recovery methods
- Pay transaction fees with Paymaster (paying for gas can be abstracted)
- Or just anything! Fully programmable

## ERC 4337 Transaction Flow

The chart above illustrates the transaction flows of an Externally Owned Account (EOA) and a smart contract account. In the EOA transaction flow, users sign transactions, which are then sent to a mempool. A mempool can be viewed as a waiting room for the transactions before they get executed by the validators.

In the case of smart contract accounts, a new mempool is introduced to collect transactions, and a different set of validators, known as bundlers, are introduced to bundle these transactions for improved off-chain efficiency. On the Ethereum network, block builders have the option to become bundlers. Bundlers have the responsibility of interacting with the newly introduced Aggregator Contract to bundle transactions, and they receive rewards for their services. The bundled transactions are then sent to the EntryPoint smart contract, where they undergo verification and execution on the blockchain.

I will go further into the technical aspect of ERC 4337 components and smart contract structure in another blog.

Ultimately, the goal is to have users interact with the blockchain without the need to understand the underlying technology similar to how we use the internet without the need to understand the network communication protocols. Moreover, I think the literal term "wallet" we use to communicate is limiting the potential of what Web3 can offer besides financial services.

The development of Account Abstraction and the implementation of ERC 4337 addressed milestones in tackling UX problems inherent in traditional crypto wallets. By making wallets programmable, users gain more control over their accounts, benefit from introduced recovery methods, and experience enhanced security features. These advancements pave the way for blockchain adoption as they offer a more user-friendly experience. As we continue to improve the UX of crypto wallets, we move closer to a future where interacting with blockchain technology becomes seamless as using the internet, unlocking a wide array of decentralized, community-driven, and innovative services. And by addressing these UX challenges, we empower individuals to participate in the decentralized economy, shaping a more inclusive and accessible digital landscape for all.

## References

- [EIP-4337](https://eips.ethereum.org/EIPS/eip-4337)
