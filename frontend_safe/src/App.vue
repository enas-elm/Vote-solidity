<template>
  <v-app>
    <v-app-bar flat color="primary">
      <v-container class="d-flex align-center justify-space-between">
        <v-toolbar-title class="text-white font-weight-bold">A voté</v-toolbar-title>
        <v-btn to="/" text class="text-white">Élection</v-btn>
        <v-btn to="/resultats" text class="text-white">Résultats</v-btn>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container class="py-8">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>
