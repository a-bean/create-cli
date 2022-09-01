import { App } from 'vue';
import VLoading from './loading';
import VClickOutSide from './clickOutside';

const install = (app: App) => {
  app.directive('loading', VLoading);
  app.directive('clickoutside', VClickOutSide);
};

export default {
  install,
};
