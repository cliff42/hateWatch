import Vue from 'vue';
import App from './App.vue';
import router from './router';
import VueCompositionApi from '@vue/composition-api';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import TrendChart from 'vue-trend-chart';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(VueCompositionApi);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(TrendChart);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
