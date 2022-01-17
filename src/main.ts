import { createApp } from 'vue';
import '@arco-design/web-vue/dist/arco.css';
import App from './App.vue';
import { router } from './router/index';
// 全局的style
import '@/styles/global.scss';

createApp(App).use(router).mount('#app');
