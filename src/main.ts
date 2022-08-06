import { createApp } from 'vue';
import App from './App.vue';
import './index.css';
import 'virtual:svg-icons-register';
import { useRegisterSW } from 'virtual:pwa-register/vue';

useRegisterSW();

const app = createApp(App);
app.config.errorHandler = (err, instance) => {
  console.error(`global err : `, err);
  console.error(`global err instance : `, instance);
  window.location.reload();
};
app.mount('#app');
