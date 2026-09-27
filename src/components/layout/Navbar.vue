<template>
  <div>
    <v-app-bar color="primary" elevation="2" class="px-2 px-md-6">
      <v-app-bar-nav-icon class="d-flex d-md-none" @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title class="font-weight-bold text-truncate">
        <v-icon icon="mdi-storefront" class="mr-1 mr-sm-2"></v-icon>
        <span class="d-none d-sm-inline">E-Commerce Dashboard</span>
        <span class="d-inline d-sm-none">Dashboard</span>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <div class="d-none d-md-flex align-center">
        <v-btn prepend-icon="mdi-format-list-bulleted" variant="text" to="/"> Products </v-btn>
      </div>

      <v-btn
        prepend-icon="mdi-cart"
        variant="text"
        color="amber-accent-2"
        to="/cart"
        class="px-2 px-sm-4"
      >
        <v-badge
          :content="cartStore.totalItems"
          color="error"
          floating
          v-if="cartStore.totalItems > 0"
        >
          <span class="d-none d-sm-inline">Cart (${{ formattedTotalPrice }})</span>
          <span class="d-inline d-sm-none">${{ formattedTotalPrice }}</span>
        </v-badge>
        <template v-else>
          <span class="d-none d-sm-inline">Cart (${{ formattedTotalPrice }})</span>
          <span class="d-inline d-sm-none">${{ formattedTotalPrice }}</span>
        </template>
      </v-btn>

      <v-btn
        :icon="themeContext?.isDarkMode.value ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        variant="text"
        class="ml-1 ml-sm-2"
        @click="themeContext?.toggleTheme()"
      ></v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary location="left">
      <v-list nav class="py-4">
        <v-list-item
          prepend-icon="mdi-format-list-bulleted"
          title="Products"
          to="/"
          @click="drawer = false"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-cart"
          title="Cart"
          :value="cartStore.totalItems"
          to="/cart"
          @click="drawer = false"
        >
          <template #append>
            <v-chip color="primary" size="small"> ${{ formattedTotalPrice }} </v-chip>
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, type Ref } from 'vue'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()

const drawer = ref(false)

const themeContext = inject<{
  isDarkMode: Ref<boolean>
  toggleTheme: () => void
}>('themeContext')

const formattedTotalPrice = computed(() => {
  const total = Number(cartStore.totalPrice)
  return isNaN(total) ? '0.00' : total.toFixed(2)
})
</script>
