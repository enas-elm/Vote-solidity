<template>
  <div>
    <h1>Inscription au vote 🗳️</h1>

    <button @click="connectWallet">Connecter Metamask</button>
    <div v-if="account">Connecté : {{ account }}</div>

    <div v-if="isRegistered" style="color: green;">
      ✅ Vous êtes déjà inscrit sous le nom : {{ nameFromContract }}
    </div>

    <input v-model="name" placeholder="Votre nom" :disabled="isRegistered" />
    <button @click="register" :disabled="!contract || isRegistered">S'inscrire</button>

    <h2>Liste des inscrits</h2>
    <ul>
      <li v-for="(voter, index) in registeredVoters" :key="index">
        {{ voter.name }} ({{ voter.address }})
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { BrowserProvider, Contract } from 'ethers';
import SafeABI from '@/abis/Safe.json';

const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const provider = ref(null);
const signer = ref(null);
const contract = ref(null);
const account = ref('');
const name = ref('');
const nameFromContract = ref('');
const isRegistered = ref(false);
const registeredVoters = ref([]);

async function connectWallet() {
  if (!window.ethereum) {
    alert("Veuillez installer MetaMask");
    return;
  }

  await window.ethereum.request({ method: "eth_requestAccounts" });

  const _provider = new BrowserProvider(window.ethereum);
  const _signer = await _provider.getSigner();
  const _contract = new Contract(contractAddress, SafeABI.abi, _signer);

  provider.value = _provider;
  signer.value = _signer;
  contract.value = _contract;

  account.value = await _signer.getAddress();

  await checkIfRegistered();
  await fetchVoters();
}

async function checkIfRegistered() {
  try {
    const [voterName, registered] = await contract.value.getVoter(account.value);
    isRegistered.value = registered;
    nameFromContract.value = voterName;
  } catch (e) {
    console.error("Erreur lors de la vérification :", e);
  }
}

async function register() {
  if (!contract.value || !account.value) {
    alert("Connecte ton wallet d'abord !");
    return;
  }

  if (isRegistered.value) {
    alert("Vous êtes déjà inscrit.");
    return;
  }

  try {
    const tx = await contract.value.register(name.value);
    await tx.wait();
    alert("Inscription réussie !");
    await checkIfRegistered();
    await fetchVoters();
  } catch (error) {
    console.error("Erreur d'inscription :", error);
  }
}

async function fetchVoters() {
  try {
    // temp signer readonly si aucun n'est connecté
    const tempProvider = new BrowserProvider(window.ethereum);
    const readOnlyContract = new Contract(contractAddress, SafeABI.abi, await tempProvider.getSigner());

    const addresses = await readOnlyContract.getVoters();
    const details = await Promise.all(addresses.map(async (addr) => {
      const [voterName, isRegistered] = await readOnlyContract.getVoter(addr);
      return { name: voterName, address: addr };
    }));
    registeredVoters.value = details;
  } catch (error) {
    console.error("Erreur lors de la récupération des votants :", error);
  }
}

// Appelle automatiquement fetchVoters au chargement
onMounted(() => {
  fetchVoters();
});
</script>
