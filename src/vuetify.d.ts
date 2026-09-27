import { createVuetify } from 'vuetify'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    VApp: (typeof import('vuetify/components'))['VApp']
    VContainer: (typeof import('vuetify/components'))['VContainer']
    VRow: (typeof import('vuetify/components'))['VRow']
    VCol: (typeof import('vuetify/components'))['VCol']
    VCard: (typeof import('vuetify/components'))['VCard']
    VBtn: (typeof import('vuetify/components'))['VBtn']
  }
}

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          background: '#F8FAFC', // خلفية رمادية هادئة ومريحة
          surface: '#FFFFFF', // لون بطاقات المنتجات والـ Cards
          primary: '#4F46E5', // أزرق بنفسجي احترافي (Indigo)
          secondary: '#64748B', // رمادي متوسط للمفاتيح والنصوص الثانوية
          success: '#10B981', // أخضر متناسق للتنبيهات والسلة
          info: '#0EA5E9', // أزرق سماوي للبطاقات التفاعلية
          warning: '#F59E0B',
          error: '#EF4444',
        },
      },
      dark: {
        dark: true,
        colors: {
          background: '#0F172A', // خلفية كحلي داكنة أنيقة جداً (Slate)
          surface: '#1E293B', // لون الكروت بالوضع المظلم
          primary: '#6366F1', // لون بارز ومتناسق مع الخلفية الداكنة
          secondary: '#94A3B8',
          success: '#34D399',
          info: '#38BDF8',
          warning: '#FBBF24',
          error: '#F87171',
        },
      },
    },
  },
})
