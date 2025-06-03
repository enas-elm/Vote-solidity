<template>
  <v-container>
    <v-card class="pa-5">
      <v-card-title>Élection 🗳️</v-card-title>
      <v-card-subtitle v-if="account">Connecté : {{ account }}</v-card-subtitle>

      <v-btn @click="connectWallet" color="primary">Connecter Metamask</v-btn>

      <v-divider class="my-4" />

      <v-alert v-if="isCandidate" type="success">✅ Candidat : {{ myCandidateName }}</v-alert>

      <v-alert v-else-if="candidateLimitReached" type="error">
        ❌ Le nombre maximum de candidats (2) est atteint.
      </v-alert>

      <v-text-field v-model="newCandidateName" label="Nom de candidat" />
      <v-btn @click="registerAsCandidate" color="secondary">Devenir candidat</v-btn>

      <v-divider class="my-4" />

      <h2>Liste des candidats</h2>
      <v-list>
        <v-list-item v-for="(c, i) in candidates" :key="i">
          <v-list-item-content>
            <v-list-item-title>{{ c.name }} — {{ c.voteCount }} vote(s)</v-list-item-title>
            <v-list-item-subtitle>{{ c.addr }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-btn v-if="account && !hasAlreadyVoted" @click="vote(c.addr)" color="green">
            Voter
          </v-btn>
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue';
import { BrowserProvider, Contract } from 'ethers';
import ElectionABI from '@/abis/Election.json';

const contractAddress = '0x5cDFF00942C363A1cC79E53475d6D3E3E9435f6A';

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
const candidateLimitReached = computed(() => candidates.value.length >= 2);

async function connectWallet() {
  if (!window.ethereum) {
    alert("Veuillez installer MetaMask");
    return;
  }

  await window.ethereum.request({ method: "eth_requestAccounts" });

  const _provider = new BrowserProvider(window.ethereum);
  const _signer = await _provider.getSigner();
  const _contract = new Contract(contractAddress, ElectionABI.abi, _signer);

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
    alert(e?.error?.message || "Erreur");
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
  const _provider = new BrowserProvider(window.ethereum);
  const _contract = new Contract(contractAddress, ElectionABI.abi, await _provider.getSigner());
  contract.value = _contract;
  await fetchCandidates();
});
</script>
