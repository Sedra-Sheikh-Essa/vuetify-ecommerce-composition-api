<template>
  <v-container class="py-4 py-sm-8 px-3 px-sm-6">
    <!-- Header Section -->
    <div class="d-flex align-center justify-space-between flex-wrap ga-2 mb-4 mb-sm-6">
      <h1 class="text-h5 text-sm-h4 font-weight-bold">Shopping Cart</h1>

      <!-- إحصائيات السلة والعداد العام المأخوذ من Store مباشرة -->
      <div v-if="cartStore.items.length > 0" class="d-flex ga-2 flex-wrap">
        <v-chip
          color="primary"
          variant="tonal"
          size="small"
          class="text-sm-body-2"
          prepend-icon="mdi-format-list-bulleted"
        >
          Total Items: {{ cartStore.totalItems }}
        </v-chip>
      </div>
    </div>

    <!-- 1. حالة السلة الفارغة -->
    <v-card
      v-if="cartStore.items.length === 0"
      class="text-center pa-6 pa-sm-12"
      elevation="2"
      rounded="xl"
    >
      <v-icon
        icon="mdi-cart-outline"
        size="80"
        class="size-sm-100 mb-4"
        color="grey-lighten-1"
      ></v-icon>
      <h2 class="text-h6 text-sm-h5 font-weight-bold text-grey-darken-1 mb-2">
        Your Cart is Empty
      </h2>
      <p class="text-body-2 text-sm-body-1 text-grey mb-6">
        Looks like you haven't added any products to your cart yet.
      </p>
      <v-btn color="primary" size="large" prepend-icon="mdi-store" rounded="lg" to="/">
        Start Shopping
      </v-btn>
    </v-card>

    <!-- 2. محتوى السلة عند وجود منتجات -->
    <v-row v-else>
      <!-- قائمة المنتجات -->
      <v-col cols="12" md="8">
        <v-card elevation="2" rounded="xl" class="pa-3 pa-sm-4">
          <v-list lines="two" class="bg-transparent pa-0">
            <template v-for="(item, index) in cartStore.items" :key="item.product.id">
              <v-list-item class="px-2 py-3">
                <div class="d-flex flex-column flex-sm-row align-start align-sm-center ga-4 w-100">
                  <!-- صورة المنتج والمعلومات الأساسية -->
                  <div class="d-flex align-center ga-3 w-100 flex-grow-1">
                    <v-avatar size="75" rounded="lg" class="bg-grey-lighten-4 flex-shrink-0 pa-1">
                      <v-img :src="item.product.image" fit="contain"></v-img>
                    </v-avatar>

                    <div class="flex-grow-1 min-w-0">
                      <v-list-item-title
                        class="font-weight-bold text-subtitle-2 text-sm-subtitle-1 text-wrap mb-1"
                      >
                        {{ item.product.title }}
                      </v-list-item-title>

                      <v-list-item-subtitle class="text-grey-darken-1 text-caption text-sm-body-2">
                        Unit Price:
                        <span class="font-weight-bold text-primary">
                          ${{ formatPrice(item.product.price) }}
                        </span>
                      </v-list-item-subtitle>
                    </div>
                  </div>

                  <!-- أزرار التحكم بالكمية والسعر الإجمالي للمنتج -->
                  <div
                    class="d-flex align-center justify-space-between justify-sm-end ga-3 w-100 w-sm-auto mt-2 mt-sm-0"
                  >
                    <div class="d-flex align-center bg-grey-lighten-4 rounded-pill px-2 py-1 ga-1">
                      <v-btn
                        icon="mdi-minus"
                        size="x-small"
                        variant="text"
                        color="primary"
                        @click="cartStore.decrementQuantity(item.product.id)"
                      ></v-btn>

                      <span class="font-weight-bold px-2 text-body-2 text-sm-body-1">{{
                        item.quantity
                      }}</span>

                      <v-btn
                        icon="mdi-plus"
                        size="x-small"
                        variant="text"
                        color="primary"
                        @click="cartStore.incrementQuantity(item.product.id)"
                      ></v-btn>
                    </div>

                    <!-- السعر الإجمالي لهذا المنتج بناءً على الكمية -->
                    <span
                      class="text-subtitle-2 text-sm-subtitle-1 font-weight-bold text-grey-darken-3 min-w-80 text-end"
                    >
                      ${{ formatPrice(Number(item.product.price) * item.quantity) }}
                    </span>

                    <!-- زر إزالة المنتج -->
                    <v-btn
                      icon="mdi-trash-can-outline"
                      variant="tonal"
                      color="error"
                      size="small"
                      @click="cartStore.removeFromCart(item.product.id)"
                    ></v-btn>
                  </div>
                </div>
              </v-list-item>

              <v-divider v-if="index < cartStore.items.length - 1" class="my-2 my-sm-3"></v-divider>
            </template>
          </v-list>
        </v-card>
      </v-col>

      <!-- ملخص الطلب Order Summary -->
      <v-col cols="12" md="4">
        <v-card elevation="2" rounded="xl" class="pa-4 pa-sm-6 sticky-top">
          <h2 class="text-h6 font-weight-bold mb-4">Order Summary</h2>

          <div class="d-flex justify-space-between mb-3 text-body-2 text-sm-body-1">
            <span class="text-grey-darken-1">Total Items</span>
            <span class="font-weight-bold">{{ cartStore.totalItems }}</span>
          </div>

          <div class="d-flex justify-space-between mb-3 text-body-2 text-sm-body-1">
            <span class="text-grey-darken-1">Shipping</span>
            <span class="font-weight-bold text-success">Free</span>
          </div>

          <v-divider class="my-3 my-sm-4"></v-divider>

          <div class="d-flex justify-space-between mb-6 text-subtitle-1 text-sm-h6">
            <span class="font-weight-bold">Total Price</span>
            <span class="font-weight-bold text-primary">${{ formattedTotalPrice }}</span>
          </div>

          <v-btn
            block
            color="primary"
            size="large"
            rounded="lg"
            class="mb-3 font-weight-bold"
            prepend-icon="mdi-check-circle-outline"
            @click="handleCheckout"
          >
            Proceed to Checkout
          </v-btn>

          <v-btn
            block
            variant="outlined"
            color="error"
            size="medium"
            rounded="lg"
            prepend-icon="mdi-delete-sweep-outline"
            @click="cartStore.clearCart"
          >
            Clear Cart
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- رسالة عند الضغط على Checkout -->
    <v-snackbar v-model="checkoutSuccess" timeout="3000" color="success" rounded="pill">
      <v-icon icon="mdi-check-circle" class="mr-2"></v-icon>
      Order placed successfully! Thank you for shopping with us.
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const checkoutSuccess = ref<boolean>(false)

// دالة مساعدة لتنسيق أي سعر بأمان مع خانتين عشريتين
const formatPrice = (val: number | string): string => {
  const num = Number(val)
  return isNaN(num) ? '0.00' : num.toFixed(2)
}

// حساب السعر الإجمالي للسلة بأمان
const formattedTotalPrice = computed(() => {
  return formatPrice(cartStore.totalPrice)
})

const handleCheckout = () => {
  checkoutSuccess.value = true
  setTimeout(() => {
    cartStore.clearCart()
  }, 1000)
}
</script>

<style scoped>
@media (min-width: 960px) {
  .sticky-top {
    position: sticky;
    top: 80px;
  }
}

.min-w-0 {
  min-width: 0;
}

.min-w-80 {
  min-width: 80px;
}
</style>
