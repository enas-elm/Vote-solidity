# 🗳️ Blockchain Voting App

This project is a voting system using **Solidity (Hardhat)** for the smart contract and **Vue + Vuetify** for the frontend UI.

## 📦 Technologies

- [Solidity](https://soliditylang.org/) (Smart contract)
- [Hardhat](https://hardhat.org/) (Blockchain dev environment)
- [Vue 3](https://vuejs.org/)
- [Vuetify 3](https://next.vuetifyjs.com/) (UI components)
- [Ethers.js](https://docs.ethers.org/)
- [MetaMask](https://metamask.io/) (for wallet connection)

## 🚀 Features

### ✅ Voter Interaction

- Connect your MetaMask wallet
- Register as a candidate (limited to 5 candidates)
- Cast one vote per wallet
- Prevents duplicate voting and candidate registration

### 📊 Public Transparency

- View the list of all registered candidates and their vote counts
- Track total number of voters
- No wallet connection is needed to view results

### ⚙️ Smart Contract Logic

- Solidity contract `Election.sol` contains:
  - Candidate registration
  - Voting logic
  - Data querying (candidates, votes, counters)
  - Pre-fills candidates for testing
  - Deploy on Sepolia testnet with adress : 0xBab9303C031C744F76Ac7F2BafCd8A298Abee9dd

## 🛠️ Project Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/election-dapp.git
cd election-dapp
```

### 2. Install dependencies

Backend

```bash
cd backend_safe
npm install
```

Frontend

```bash
cd ../frontend_safe
npm install
```

### 3. Configure environment

Create a .env file inside backend_safe/:

.env

```bash
PRIVATE_KEY=your-wallet-private-key
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your-infura-id
```

### 4. Compile and deploy the contract

```bash
cd backend_safe
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

Copy the deployed address and update it in your frontend Election.vue and Resulats.vue:

```bash
const contractAddress = '0xYourContractAddress';
```

### 5. Run the frontend

```bash
cd ../frontend_safe
npm run dev
```
