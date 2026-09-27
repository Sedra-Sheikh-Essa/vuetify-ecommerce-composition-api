<template>
  <v-card class="mx-auto h-100 d-flex flex-column pa-2" elevation="2" rounded="lg">
    <v-img :src="product.image" height="200" contain class="align-end bg-white pa-2"></v-img>

    <v-card-title class="text-subtitle-1 font-weight-bold text-truncate mt-2">
      {{ product.title }}
    </v-card-title>

    <v-card-subtitle class="text-capitalize text-grey-darken-1">
      {{ product.category }}
    </v-card-subtitle>

    <v-card-text class="flex-grow-1">
      <div class="d-flex align-center justify-space-between mb-2">
        <!-- 🎯 الخصم يمرر فقط للمنتجات التي سعرها أكبر من 50 -->
        <span
          v-discount-badge="product.price > 50 ? 15 : 0"
          class="text-h6 font-weight-bold text-primary"
        >
          {{ formatPrice(product.price) }}
        </span>

        <div class="d-flex align-center">
          <v-icon color="amber" icon="mdi-star" size="small" class="mr-1"></v-icon>
          <span class="text-caption font-weight-bold">{{ product.rating?.rate }}</span>
        </div>
      </div>
    </v-card-text>

    <v-card-actions class="d-flex flex-column ga-2">
      <v-btn block variant="outlined" color="primary" :to="`/product/${product.id}`">
        View Details
      </v-btn>

      <v-btn
        block
        color="primary"
        variant="elevated"
        prepend-icon="mdi-cart-plus"
        @click="handleAddToCart"
      >
        Add to Cart
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { Product } from '@/types/product'
import useCurrency from '@/composables/useCurrency'

interface ExtendedProduct extends Product {
  discountPercentage?: number
}

// 1. [Props]
const props = defineProps<{
  product: ExtendedProduct
}>()

// 2. [Emits]
const emit = defineEmits<{
  (e: 'add-to-cart', product: Product): void
}>()

// 3. [Mixins / Composables]
const { formatPrice } = useCurrency()

// 4. [Custom Directive]: التعرّف على الخصم وتغيير مظهر الـ DOM تلقائياً
const vDiscountBadge = {
  mounted: (el: HTMLElement, binding: { value: number }) => {
    const discount = binding.value || 0

    // ينفذ التنسيق فقط إذا كان الخصم أكبر من صفر
    if (discount > 0) {
      el.style.color = '#d32f2f' // لون أحمر للسعر

      const badge = document.createElement('span')
      badge.textContent = ` (${discount}% OFF)`
      badge.style.fontSize = '0.75rem'
      badge.style.color = '#388e3c'
      badge.style.backgroundColor = '#e8f5e9'
      badge.style.padding = '2px 6px'
      badge.style.borderRadius = '4px'
      badge.style.marginLeft = '6px'

      el.appendChild(badge)
    }
  },
}

const handleAddToCart = () => {
  emit('add-to-cart', props.product)
}
</script>
