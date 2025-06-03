<template>
  <v-container>
    <h2>Élection 🗳️</h2>

    <v-btn @click="connectWallet" color="primary">Connecter Metamask</v-btn>
    <div v-if="account" class="mt-2">Connecté : {{ account }}</div>

    <v-alert v-if="isCandidate" type="success" class="mt-4">
      ✅ Vous êtes candidat sous le nom : {{ myCandidateName }}
    </v-alert>

    <div v-else-if="account" class="mt-4">
      <v-alert v-if="candidateLimitReached" type="error">
        ❌ Le nombre maximum de candidats (2) est atteint.
      </v-alert>
      <div v-else>
        <v-text-field v-model="newCandidateName" label="Votre nom de candidat" />
        <v-btn @click="registerAsCandidate" color="success">Devenir candidat</v-btn>
      </div>
    </div>

    <v-alert v-if="hasAlreadyVoted" type="info" class="mt-4">
      🗳️ Vous avez déjà voté pour : {{ votedCandidateName }}
    </v-alert>

    <h3 class="mt-8">Liste des candidats</h3>
    <v-list>
      <v-list-item
        v-for="(c, i) in candidates"
        :key="i"
        class="border rounded mb-2"
      >
        <v-list-item-content>
          <v-list-item-title><strong>{{ c.name }}</strong> — {{ c.voteCount }} vote(s)</v-list-item-title>
          <v-list-item-subtitle>{{ c.addr }}</v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action v-if="account && !hasAlreadyVoted">
          <v-btn @click="vote(c.addr)" color="primary" size="small">Voter</v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { BrowserProvider, Contract } from 'ethers';
import ElectionABI from '@/abis/Election.json';

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
const candidateLimitReached = computed(() => candidates.value.length >= 2);

async function connectWallet() {
  if (!window.ethereum) return alert("Veuillez installer MetaMask");
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
  const all = await contract.value.getCandidates();
  candidates.value = all.map(c => ({
    name: c.name,
    addr: c.addr,
    voteCount: Number(c.voteCount)
  }));
}

async function registerAsCandidate() {
  if (!newCandidateName.value) return alert("Entrez un nom");
  const tx = await contract.value.registerAsCandidate(newCandidateName.value);
  await tx.wait();
  alert("Inscription réussie !");
  await checkCandidateStatus();
  await fetchCandidates();
}

async function vote(candidateAddress) {
  const tx = await contract.value.vote(candidateAddress);
  await tx.wait();
  alert("Vote enregistré !");
  await checkVoteStatus();
  await fetchCandidates();
}

async function checkCandidateStatus() {
  if (!contract.value || !account.value) return;
  const [name] = await contract.value.getCandidate(account.value);
  isCandidate.value = name.length > 0;
  myCandidateName.value = name;
}

async function checkVoteStatus() {
  if (!contract.value || !account.value) return;
  const [hasVoted, votedAddr] = await contract.value.hasVoted(account.value);
  hasAlreadyVoted.value = hasVoted;
  votedCandidateAddress.value = votedAddr;

  if (hasVoted) {
    const [name] = await contract.value.getCandidate(votedAddr);
    votedCandidateName.value = name;
  }
}

onMounted(async () => {
  const _provider = new BrowserProvider(window.ethereum);
  const _contract = new Contract(contractAddress, ElectionABI.abi, await _provider.getSigner());
  contract.value = _contract;
  await fetchCandidates();
});
</script>
