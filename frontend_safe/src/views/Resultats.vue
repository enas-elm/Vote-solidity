<template>
    <v-container>
        <v-row>
            <v-col>
                <h1 class="text-h4 mb-4">📊 Résultats de l'élection</h1>

                <v-list two-line>
                    <v-list-item v-for="(candidate, index) in candidates" :key="index">
                        <v-list-item-content>
                            <v-list-item-title>{{ candidate.name }}</v-list-item-title>
                            <v-list-item-subtitle>
                                Adresse : {{ candidate.addr }}
                            </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-chip color="primary" variant="flat">
                                {{ candidate.voteCount }} vote(s)
                            </v-chip>
                        </v-list-item-action>
                    </v-list-item>
                </v-list>

                <v-alert type="info" class="mt-4" v-if="candidates.length === 0">
                    Aucun candidat pour le moment.
                </v-alert>
            </v-col>
        </v-row>
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
