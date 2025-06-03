<template>
  <v-container class="py-10">
    <!-- Section Bienvenue -->

        <h1 class="text-h4 mb-2  font-weight-semibold">Bienvenue dans l’élection</h1>

        <p  class="text-subtitle-1 text-grey-darken-2 mb-2">
           Connectez votre portefeuille pour voter ou devenir candidat. <br />
        Il peut y avoir au maximum <strong>5 candidats</strong>.</p>

    <!-- Bouton Connexion -->
    <v-btn
      @click="connectWallet"
      color="primary"
      variant="flat"
      class="mb-6 rounded-xl text-white"
    >
      Connecter Metamask
    </v-btn>

    <!-- Alerte de connexion -->
    <v-alert v-if="account" type="info" variant="tonal" class="mb-6 rounded-xl shadow-sm">
      🔗 Connecté : <strong>{{ account }}</strong>
    </v-alert>

    <v-divider class="my-6" />

    <!-- Candidat déjà inscrit -->
    <v-alert
      v-if="isCandidate"
      type="success"
      variant="tonal"
      class="mb-4 rounded-xl shadow-sm"
    >
      🎯 Vous êtes candidat : <strong>{{ myCandidateName }}</strong>
    </v-alert>

    <!-- Limite atteinte -->
    <v-alert
      v-else-if="candidateLimitReached"
      type="warning"
      variant="tonal"
      class="mb-4 rounded-xl shadow-sm"
    >
      ⚠️ Le nombre maximum de candidats (5) est atteint.
    </v-alert>

    <!-- Formulaire Candidat -->
    <div v-else-if="account" class="mb-8">
      <v-text-field
        v-model="newCandidateName"
        label="Votre nom de candidat"
        density="comfortable"
        variant="outlined"
        rounded
      />
      <v-btn
        color="success"
        variant="flat"
        class="rounded-xl shadow-sm text-white"
        @click="registerAsCandidate"
      >
        Devenir candidat
      </v-btn>
    </div>

    <v-divider class="my-10" />

    <!-- Déjà voté -->
    <v-alert
      v-if="hasAlreadyVoted"
    type="success"
      variant="tonal"
      class="mb-6 rounded-xl shadow-sm"
    >
      🗳️ Vous avez déjà voté pour : <strong>{{ votedCandidateName }}</strong>
    </v-alert>

    <!-- Liste des candidats -->
    <h3 class="text-h6 font-weight-medium mt-8 mb-4">
      Liste des candidats
    </h3>

    <v-row>
      <v-col
        cols="12"
        md="6"
        lg="4"
        v-for="c in candidates"
        :key="c.addr"
      >
        <v-card variant="flat" class="pa-5 rounded-xl shadow-md hover:shadow-lg transition-all  bg-blue-lighten-5 ">
          <div class="justify-space-between align-center mb-3">
            <div class=" mb-3">
              <h4 class="text-subtitle-1 font-weight-bold">{{ c.name }}</h4>
              <small class="text-grey-darken-1">{{ c.addr }}</small>
            </div>
        <v-chip
  color="primary"
  class="font-weight-medium text-caption"
  variant="flat"
  text-color="white"
  size="small"
>
  {{ c.voteCount }} vote{{ c.voteCount > 1 ? 's' : '' }}
</v-chip>
          </div>

          <v-btn
            v-if="account && !hasAlreadyVoted"
            color="primary"
            variant="flat"
            size="small"
            class="rounded-xl shadow-sm text-white"
            @click="vote(c.addr)"
          >
            Voter
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
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
