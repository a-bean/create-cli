import { createApp } from 'vue';
import '@arco-design/web-vue/dist/arco.css';
import App from './App.vue';
import { router } from './router/index';
import directives from './directives';
// 全局的style
import '@/styles/global.scss';
// 这三种支持函数调用的组件的样式要手动引入一下
import '@arco-design/web-vue/es/message/style/css';
import '@arco-design/web-vue/es/modal/style/css';
import '@arco-design/web-vue/es/notification/style/css';

createApp(App).use(router).use(directives).mount('#app');
