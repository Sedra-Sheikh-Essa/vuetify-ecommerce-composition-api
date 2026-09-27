<template>
  <v-container class="py-4 py-sm-8">
    <!-- زر العودة للمنتجات -->
    <v-btn prepend-icon="mdi-arrow-left" variant="text" color="primary" class="mb-4 mb-sm-6" to="/">
      Back to Products
    </v-btn>

    <!-- حالة التحميل -->
    <div v-if="loading" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="mt-4 text-grey">Loading product details...</p>
    </div>

    <!-- عرض تفاصيل المنتج -->
    <v-card v-else-if="product" class="pa-4 pa-sm-6" elevation="2" rounded="lg">
      <v-row align="center">
        <!-- صورة المنتج -->
        <v-col cols="12" md="6">
          <v-img
            :src="product.image"
            height="250"
            max-height="400"
            sm-height="350"
            contain
            class="bg-white mx-auto"
          ></v-img>
        </v-col>

        <!-- معلومات المنتج -->
        <v-col cols="12" md="6">
          <v-chip color="primary" size="small" class="text-capitalize mb-2">
            {{ product.category }}
          </v-chip>

          <h1 class="text-h5 text-sm-h4 font-weight-bold mb-3 mb-sm-4">
            {{ product.title }}
          </h1>

          <div class="d-flex align-center flex-wrap ga-2 mb-4">
            <v-rating
              :model-value="product.rating?.rate"
              color="amber"
              density="compact"
              half-increments
              readonly
            ></v-rating>
            <span class="text-body-2 text-grey"> ({{ product.rating?.count }} reviews) </span>
          </div>

          <p class="text-h5 text-sm-h4 font-weight-bold text-primary mb-4 mb-sm-6">
            ${{ product.price }}
          </p>

          <p class="text-body-2 text-sm-body-1 text-grey-darken-1 mb-6">
            {{ product.description }}
          </p>

          <!-- زر الإضافة للسلة (يمتد بعرض الشاشة في الهواتف) -->
          <v-btn
            color="primary"
            size="large"
            block
            class="d-sm-none"
            prepend-icon="mdi-cart-plus"
            @click="handleAddToCart"
          >
            Add to Cart
          </v-btn>
          <v-btn
            color="primary"
            size="large"
            class="d-none d-sm-inline-flex"
            prepend-icon="mdi-cart-plus"
            @click="handleAddToCart"
          >
            Add to Cart
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- تنبيه الإضافة للسلة -->
    <v-snackbar v-model="snackbar" timeout="2000" color="success">
      Product added to cart successfully!
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'
import type { Product } from '@/types/product'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const cartStore = useCartStore()

const product = ref<Product | null>(null)
const loading = ref<boolean>(true)
const snackbar = ref<boolean>(false)

onMounted(async () => {
  const productId = route.params.id
  try {
    const response = await api.get<Product>(`/products/${productId}`)
    product.value = response.data
  } catch (error) {
    console.error('Error fetching product details:', error)
  } finally {
    loading.value = false
  }
})

const handleAddToCart = () => {
  if (product.value) {
    cartStore.addToCart(product.value)
    snackbar.value = true
  }
}
</script>
