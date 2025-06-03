<template>
  <v-app>
    <v-app-bar color="primary" dark>
      <v-app-bar-title>🗳️ Système de Vote</v-app-bar-title>

      <v-spacer />

      <v-btn to="/" variant="text" router>
        Accueil
      </v-btn>
      <v-btn to="/election" variant="text" router>
        Élection
      </v-btn>
      <v-btn to="/resultats" variant="text" router>
        Résultats
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
</script>
