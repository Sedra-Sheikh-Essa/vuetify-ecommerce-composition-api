import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Product } from '@/types/product'

export interface CartItem {
  product: Product
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  // 1: دالة آمنة لقراءة البيانات من localStorage عند الإقلاع
  const loadInitialItems = (): CartItem[] => {
    try {
      const savedItems = localStorage.getItem('cart_items')
      return savedItems ? JSON.parse(savedItems) : []
    } catch (error) {
      console.error('Failed to parse cart items from localStorage:', error)
      return []
    }
  }

  const items = ref<CartItem[]>(loadInitialItems())

  // 2: حفظ السلة تلقائياً عند أي تغيير
  watch(
    items,
    (newItems) => {
      localStorage.setItem('cart_items', JSON.stringify(newItems))
    },
    { deep: true },
  )

  // 3: حساب مجموع القطع
  const totalItems = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  // 4: حساب السعر الإجمالي مع تقريب الكسور لتفادي أخطاء الـ Floating Point
  const totalPrice = computed(() => {
    const total = items.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    return Math.round(total * 100) / 100
  })

  // 5: إضافة منتج للسلة
  const addToCart = (product: Product) => {
    const existingItem = items.value.find((item) => item.product.id === product.id)
    if (existingItem) {
      existingItem.quantity++
    } else {
      items.value.push({ product, quantity: 1 })
    }
  }

  // 6:  زيادة الكمية بمقدار 1
  const incrementQuantity = (productId: number) => {
    const item = items.value.find((item) => item.product.id === productId)
    if (item) {
      item.quantity++
    }
  }

  // 7:  إنقاص الكمية بمقدار 1 (والحذف تلقائياً لو أصبحت أقل من 1)
  const decrementQuantity = (productId: number) => {
    const item = items.value.find((item) => item.product.id === productId)
    if (item) {
      if (item.quantity > 1) {
        item.quantity--
      } else {
        removeFromCart(productId)
      }
    }
  }

  // 8: حذف عنصر من السلة
  const removeFromCart = (productId: number) => {
    items.value = items.value.filter((item) => item.product.id !== productId)
  }

  // 9: تحديث الكمية بأمان (حذف المنتج لو أدخل المستخدم 0 أو قيمة سالبة)
  const updateQuantity = (productId: number, quantity: number) => {
    const item = items.value.find((item) => item.product.id === productId)
    if (!item) return

    const parsedQty = Math.floor(quantity)
    if (parsedQty > 0) {
      item.quantity = parsedQty
    } else {
      removeFromCart(productId)
    }
  }

  // 10:  تفريغ السلة وتحديث الحفظ مباشرة
  const clearCart = () => {
    items.value = []
    localStorage.removeItem('cart_items')
  }

  return {
    items,
    totalItems,
    totalPrice,
    addToCart,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    updateQuantity,
    clearCart,
  }
})
