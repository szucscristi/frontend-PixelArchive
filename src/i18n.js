// src/i18n.js
import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import ro from './locales/ro.json'

export default createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en, ro }
})
