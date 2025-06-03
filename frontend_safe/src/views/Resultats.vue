<template>
  <v-container class="py-10">
    <h1 class="text-h4 font-weight-semibold mb-6">Résultats de l'élection</h1>

    <v-row>
      <v-col
        cols="12"
        md="6"
        lg="4"
        v-for="(candidate, index) in candidates"
        :key="index"
      >
        <v-card
          variant="flat"
          class="pa-5 rounded-xl shadow-md hover:shadow-lg transition-all bg-blue-lighten-5"
        >
          <div class="justify-space-between align-center mb-4">
            <div class="mb-2">
              <h4 class="text-subtitle-1 font-weight-bold">{{ candidate.name }}</h4>
              <small class="text-grey-darken-1">Adresse : {{ candidate.addr }}</small>
            </div>

            <v-chip
              color="primary"
              variant="flat"
              class="font-weight-medium text-white"
            >
              {{ candidate.voteCount }} vote{{ candidate.voteCount > 1 ? 's' : '' }}
            </v-chip>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-alert
      type="info"
      variant="tonal"
      class="mt-6 rounded-xl shadow-sm"
      v-if="candidates.length === 0"
    >
      Aucun candidat pour le moment.
    </v-alert>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { BrowserProvider, Contract } from 'ethers'
import ElectionABI from '@/abis/Election.json'

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
const candidates = ref([])
const contract = ref(null)

async function fetchResults() {
  try {
    const provider = new BrowserProvider(window.ethereum)
    contract.value = new Contract(contractAddress, ElectionABI.abi, await provider.getSigner())

    const all = await contract.value.getCandidates()
    candidates.value = all.map(c => ({
      name: c.name,
      addr: c.addr,
      voteCount: Number(c.voteCount)
    }))
  } catch (e) {
    console.error('Erreur chargement résultats', e)
  }
}

onMounted(fetchResults)
</script>
