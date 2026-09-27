<template>
  <v-app :theme="isDarkMode ? 'dark' : 'light'">
    <Navbar />

    <v-main>
      <router-view />
    </v-main>

    <v-snackbar
      v-model="globalSnackbar.show"
      :color="globalSnackbar.color"
      timeout="3000"
      location="bottom"
      rounded="pill"
    >
      {{ globalSnackbar.message }}
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { ref, provide, onMounted, onUnmounted } from 'vue'
import Navbar from '@/components/layout/Navbar.vue'
import { SimpleEventBus } from '@/utils/eventBus'

// Provide & Inject
const isDarkMode = ref(false)
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
}
provide('themeContext', { isDarkMode, toggleTheme })

// إعداد حالة الـ Snackbar
const globalSnackbar = ref({
  show: false,
  message: '',
  color: 'success',
})

const handleNotification = (data: { message: string; color?: string }) => {
  globalSnackbar.value = {
    show: true,
    message: data.message,
    color: data.color || 'success',
  }
}

//  الاشتراك والتنظيف باستخدام mitt
onMounted(() => {
  SimpleEventBus.on('show-notification', handleNotification)
})

onUnmounted(() => {
  SimpleEventBus.off('show-notification', handleNotification)
})
</script>
