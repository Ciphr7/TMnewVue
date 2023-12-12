/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'
import VueGoogleMaps from '@fawmi/vue-google-maps'

// Components
import App from './App.vue'
import { apiKey } from './components/googleApiKey'

// Composables
import { createApp } from 'vue'

const app = createApp(App)

app.use(VueGoogleMaps, {
    load: {
        key: apiKey,
    },
})

registerPlugins(app)

app.mount('#app')
