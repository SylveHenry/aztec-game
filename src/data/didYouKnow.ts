export const didYouKnowFacts = [
  "Aztec enables programmable privacy across the entire Ethereum ecosystem.",
  "Aztec uses zero-knowledge proofs to enable private transactions.",
  "Aztec supports private, public, and hybrid smart contract execution.",
  "Aztec invented PLONK, which underpins modern zk proving systems and zkVMs.",
  "Aztec has a native account abstraction model, allowing you to choose your signature type.",
  "Aztec enables privacy and full composability across private and public calls.",
  "all Aztec transactions start off private, since account and transaction entrypoints are private.",
  "Aztec is the first L2 to launch a decentralized testnet on day 1.",
  "Aztec Connect was the first private DeFi application.",
  "Aztec was founded in 2017 and continues to innovate in blockchain privacy.",
  "Aztec is a trustless, scalable, decentralized Privacy Layer 2 (L2) solution called a hybrid zkRollup.",
  "Aztec utilizes a UTXO architecture, enabling the development of applications and tools on public smart contract platforms.",
  "Aztec primarily supports the Noir programming language, which is designed for zero-knowledge proofs.",
  "Noir, Aztec's main language, is based on Rust syntax and aims to make developing zero-knowledge applications more accessible.",
  "Aztec supports both public and private smart contract execution while preserving user privacy.",
  "Aztec's ecosystem includes wallets like Obsidion and Azguard, which support private transactions.",
  "you can explore Aztec's network activity using block explorers like Aztec Explorer and AztecScan.",
  "Aztec offers a grants program to support developers building with Noir and privacy-preserving technologies.",
  "Aztec's documentation provides a quickstart guide and tutorials to help you get started building private applications.",
  "Aztec's hybrid zkRollup design allows for both privacy and scalability, secured by Ethereum."
];

/**
 * Returns a random "Did you know" fact about Aztec
 */
export const getRandomDidYouKnowFact = (): string => {
  const randomIndex = Math.floor(Math.random() * didYouKnowFacts.length);
  return `Do you know: ${didYouKnowFacts[randomIndex]}`;
};