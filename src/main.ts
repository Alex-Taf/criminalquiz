import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './main.css'

import App from './App.vue'
import router from './router'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

import Notifications from '@kyvg/vue3-notification'

import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';

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
app.component('EasyDataTable', Vue3EasyDataTable)
app.mount('#app')
