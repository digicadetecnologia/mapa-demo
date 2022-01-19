<template>
  <q-layout view="hHh Lpr lFf">
    <q-header class="bg-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title class="text-center">
          Estudos Vue JS com Quasar
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'MainLayout',

      data() {
        return {};
      }
}
</script>
