import Vue from 'vue'
import App from './App.vue'
import store from './store';
import * as VueGoogleMaps from 'vue2-google-maps'
import './registerServiceWorker'
import inViewportDirective from 'vue-in-viewport-directive'
import ComponentSystem from 'components-system';
import Vuetify from 'vuetify'
import VueVirtualScroller from 'vue-virtual-scroller'
import 'vuetify/dist/vuetify.min.css'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

Vue.use(VueVirtualScroller)

Vue.use(ComponentSystem);
Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.GOOGLE_MAP_API_KEY,
  }
});

Vue.directive('in-viewport', inViewportDirective)

if (process.env.NODE_ENV === 'production') {
  console.info('Production');
}
Vue.config.productionTip = process.env.NODE_ENV === 'production';

Vue.use(Vuetify);

const opts = {}
const vuetify = new Vuetify(opts)

new Vue({
  render: h => h(App),
  vuetify,
  store
}).$mount('#app')

window.googleTranslateElementInit = () => {
  new google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
};
