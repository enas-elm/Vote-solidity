<template>
  <div>
    <h1>Élection 🗳️</h1>

    <button @click="connectWallet">Connecter Metamask</button>
    <div v-if="account">Connecté : {{ account }}</div>

    <div v-if="isCandidate" style="color: green;">
      ✅ Vous êtes candidat sous le nom : {{ myCandidateName }}
    </div>

    <div v-else-if="account">
      <input v-model="newCandidateName" placeholder="Votre nom de candidat" />
      <button @click="registerAsCandidate">Devenir candidat</button>
    </div>

    <div v-if="hasAlreadyVoted" style="color: blue;">
      🗳️ Vous avez déjà voté pour : {{ votedCandidateName }}
    </div>

    <h2>Liste des candidats</h2>
    <ul>
      <li v-for="(c, i) in candidates" :key="i">
        <strong>{{ c.name }}</strong> — {{ c.voteCount }} vote(s)
        <br />
        <span style="font-size: 0.8em; color: gray;">{{ c.addr }}</span>
        <br />
        <button
          v-if="account && !hasAlreadyVoted"
          @click="vote(c.addr)"
        >
          Voter pour {{ c.name }}
        </button>
        <hr />
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { BrowserProvider, Contract } from 'ethers';
import SafeABI from '@/abis/Safe.json';

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const provider = ref(null);
const signer = ref(null);
const contract = ref(null);
const account = ref('');

const newCandidateName = ref('');
const isCandidate = ref(false);
const myCandidateName = ref('');

const hasAlreadyVoted = ref(false);
const votedCandidateAddress = ref('');
const votedCandidateName = ref('');

const candidates = ref([]);

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

  await checkCandidateStatus();
  await checkVoteStatus();
}

async function fetchCandidates() {
  try {
    const all = await contract.value.getCandidates();
    candidates.value = all.map((c) => ({
      name: c.name,
      addr: c.addr,
      voteCount: Number(c.voteCount),
    }));
  } catch (e) {
    console.error('Erreur chargement candidats', e);
  }
}

async function registerAsCandidate() {
  if (!newCandidateName.value) {
    alert('Entrez un nom');
    return;
  }

  try {
    const tx = await contract.value.registerAsCandidate(newCandidateName.value);
    await tx.wait();
    alert("Inscription comme candidat réussie !");
    await checkCandidateStatus();
    await fetchCandidates();
  } catch (e) {
    console.error('Erreur inscription candidat', e);
  }
}

async function vote(candidateAddress) {
  try {
    const tx = await contract.value.vote(candidateAddress);
    await tx.wait();
    alert("Vote enregistré !");
    await checkVoteStatus();
    await fetchCandidates();
  } catch (e) {
    console.error("Erreur lors du vote :", e);
  }
}

async function checkCandidateStatus() {
  if (!contract.value || !account.value) return;

  try {
    const [name, voteCount] = await contract.value.getCandidate(account.value);
    if (name && name.length > 0) {
      isCandidate.value = true;
      myCandidateName.value = name;
    } else {
      isCandidate.value = false;
    }
  } catch (e) {
    isCandidate.value = false;
  }
}

async function checkVoteStatus() {
  if (!contract.value || !account.value) return;

  try {
    const [hasVoted, votedAddr] = await contract.value.hasVoted(account.value);
    hasAlreadyVoted.value = hasVoted;
    votedCandidateAddress.value = votedAddr;

    if (hasVoted) {
      const [name] = await contract.value.getCandidate(votedAddr);
      votedCandidateName.value = name;
    }
  } catch (e) {
    console.error('Erreur lecture vote', e);
  }
}

onMounted(async () => {
  // Charger les candidats même sans MetaMask connecté
  const _provider = new BrowserProvider(window.ethereum);
  const _contract = new Contract(contractAddress, SafeABI.abi, await _provider.getSigner());
  contract.value = _contract;

  await fetchCandidates();
});
</script>
