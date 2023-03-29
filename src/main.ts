import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './style.css'

import App from './App.vue'
import router from './router'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

import Notifications from '@kyvg/vue3-notification'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  }
})

const app = createApp(App)

app.use(createPinia()) //use pinia
app.use(router) //use router
app.use(vuetify)
app.use(Notifications)
app.mount('#app')
