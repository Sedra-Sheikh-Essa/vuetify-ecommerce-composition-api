<template>
  <v-container class="py-4 py-sm-6 px-3 px-sm-6">
    <!-- Filter Controls -->
    <v-row class="mb-2 mb-sm-4" align="center">
      <v-col cols="12" sm="6" md="5">
        <v-text-field
          ref="searchInputRef"
          v-model="searchQuery"
          label="Search products..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          color="primary"
          hide-details
          clearable
          density="comfortable"
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <v-select
          v-model="selectedCategory"
          :items="categories"
          label="Category"
          variant="outlined"
          color="primary"
          hide-details
          density="comfortable"
        ></v-select>
      </v-col>

      <v-col cols="12" md="3" class="d-flex ga-2">
        <v-btn
          color="primary"
          variant="tonal"
          block
          height="48"
          class="h-md-56"
          prepend-icon="mdi-text-search"
          @click="focusSearchInput"
        >
          Focus Search
        </v-btn>
      </v-col>
    </v-row>

    <!-- Status Bar -->
    <v-row class="mb-3 mb-sm-4">
      <v-col cols="12" class="d-flex flex-wrap ga-2 align-center">
        <!-- Query Icon -->
        <v-chip color="primary" variant="tonal" size="small" prepend-icon="mdi-magnify">
          Query: {{ searchQuery || 'All Products' }}
        </v-chip>

        <!-- Results Icon -->
        <v-chip color="info" variant="tonal" size="small" prepend-icon="mdi-format-list-bulleted">
          Found: {{ filteredProducts.length }} products
        </v-chip>

        <!-- Cart Icon -->
        <v-chip color="success" variant="tonal" size="small" prepend-icon="mdi-cart-outline">
          Cart Items Count: {{ cartStore.totalItems }}
        </v-chip>

        <!-- Last Search Time Icon -->
        <v-chip
          color="warning"
          variant="tonal"
          size="small"
          v-if="filterStats.lastSearchTime"
          prepend-icon="mdi-clock-outline"
        >
          Last Search Time: {{ filterStats.lastSearchTime }}
        </v-chip>

        <!-- Theme Icon -->
        <v-chip color="secondary" variant="tonal" size="small" prepend-icon="mdi-theme-light-dark">
          Theme: {{ themeContext?.isDarkMode.value ? 'Dark' : 'Light' }}
        </v-chip>
      </v-col>
    </v-row>

    <!-- Cart Watcher Alert -->
    <v-alert
      v-if="watchCartMessage"
      type="success"
      variant="tonal"
      closable
      class="mb-4"
      density="compact"
      @click:close="watchCartMessage = ''"
    >
      {{ watchCartMessage }}
    </v-alert>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="mt-4 text-medium-emphasis">Loading products...</p>
    </div>

    <!-- Error -->
    <v-alert v-else-if="errorMessage" type="error" variant="tonal" class="mb-4">
      {{ errorMessage }}
    </v-alert>

    <!-- Products Grid -->
    <v-row v-else>
      <v-col v-for="product in filteredProducts" :key="product.id" cols="12" sm="6" md="4" lg="3">
        <ProductCard :product="product" @add-to-cart="handleAddToCart" />
      </v-col>

      <v-col v-if="filteredProducts.length === 0" cols="12" class="text-center py-8">
        <v-icon icon="mdi-package-variant-remove" size="64" color="secondary"></v-icon>
        <p class="text-h6 text-medium-emphasis mt-2">No products found</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  computed,
  watch,
  onMounted,
  onUpdated,
  onUnmounted,
  inject,
  type Ref,
} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/services/api'
import type { Product } from '@/types/product'
import ProductCard from '@/components/product/ProductCard.vue'
import { useCartStore } from '@/stores/cart'
import { SimpleEventBus } from '@/utils/eventBus'

// Stores and router
const cartStore = useCartStore()
const router = useRouter()
const route = useRoute()

// Template Ref
const searchInputRef = ref<HTMLInputElement | null>(null)

// State
const products = ref<Product[]>([])
const loading = ref<boolean>(true)
const errorMessage = ref<string>('')
const searchQuery = ref<string>('')
const selectedCategory = ref<string>('All')
const watchCartMessage = ref<string>('')

// Theme Context Injection
const themeContext = inject<{
  isDarkMode: Ref<boolean>
  toggleTheme: () => void
}>('themeContext')

// Reactive stats
const filterStats = reactive({
  lastSearchTime: '',
  searchCount: 0,
})

const categories = ref<string[]>([
  'All',
  'electronics',
  'jewelery',
  "men's clothing",
  "women's clothing",
])

// Helpers and Methods
const focusSearchInput = () => {
  searchInputRef.value?.focus()
}

const handleAddToCart = (product: Product) => {
  cartStore.addToCart(product)
  SimpleEventBus.emit('show-notification', {
    message: `${product.title} added to cart`,
    color: 'success',
  })
}

// Computed properties
const filteredProducts = computed(() => {
  return products.value.filter((product) => {
    const matchesSearch = searchQuery.value
      ? product.title.toLowerCase().includes(searchQuery.value.toLowerCase())
      : true

    const matchesCategory =
      selectedCategory.value === 'All' ||
      product.category.toLowerCase() === selectedCategory.value.toLowerCase()

    return matchesSearch && matchesCategory
  })
})

// Watchers
watch(
  () => cartStore.items,
  (newItems) => {
    const count = newItems.reduce((sum, item) => sum + item.quantity, 0)
    watchCartMessage.value = `Cart total updated: ${count} items`
  },
  { deep: true },
)

watch(searchQuery, (newQuery) => {
  filterStats.searchCount++
  filterStats.lastSearchTime = new Date().toLocaleTimeString()

  router.replace({
    query: { ...route.query, search: newQuery || undefined },
  })
})

// Lifecycle
onMounted(async () => {
  if (route.query.search) {
    searchQuery.value = String(route.query.search)
  }

  try {
    const response = await api.get<Product[]>('/products')
    products.value = response.data
  } catch (error) {
    errorMessage.value = 'Failed to load products. Check connection.'
  } finally {
    loading.value = false
  }
})

onUpdated(() => {
  // Logic for re-renders if needed
})

onUnmounted(() => {
  // Cleanup listeners
})
</script>

<style scoped>
@media (min-width: 960px) {
  .h-md-56 {
    height: 56px !important;
  }
}
</style>
