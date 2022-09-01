/* eslint-disable vue/one-component-per-file */
import { Directive, createApp, App } from 'vue';
import { Spin } from '@arco-design/web-vue';
import { isBoolean, isObject } from '@/utils/tool';

type TBindingValue =
  | boolean
  | {
      loading: boolean;
      text: string;
    };

/** 判断对象是否包含keys */
const hasKeys = (param: unknown, keys: PropertyKey[]) => {
  if (!isObject(param)) {
    return false;
  }

  return keys.every((key) => {
    return Object.hasOwn(param as Record<string, unknown>, key);
  });
};

/** 判断是否是 包含 loading  的对象 */
const isValidObject = (param: unknown) => {
  return isObject(param) && hasKeys(param, ['loading']);
};

/** 转换函数, 把两种格式的入参都转成 对象 */
const convertDirectiveParam = (param: TBindingValue): Exclude<TBindingValue, boolean> => {
  const option = {
    loading: true,
    text: '',
  };

  if (isBoolean(param)) {
    option.loading = param as boolean;
  } else if (isValidObject(param)) {
    option.loading = (param as Exclude<TBindingValue, boolean>).loading;
    option.text = (param as Exclude<TBindingValue, boolean>).text || '';
  } else {
    console.warn('please check v-loading binding, should be boolean or { loading: boolean; text: string; }');
    option.loading = Boolean(param);
  }

  return option;
};

const loadingContainerClass = 'loadingDirectiveElement';
const loadingContainerFullScreenClass = 'fullScreen';
const relativeClass = 'posRelative';
const symbol = Symbol('vLoadingDirective');
const AppSymbol = Symbol('loadingSpinApp'); // app实例
type CustomElement = HTMLElement & { [symbol]?: Element; [AppSymbol]?: App };

const loadingDirective: Directive<CustomElement, TBindingValue> = {
  mounted: (el, binding) => {
    el.classList.remove(relativeClass);
    const originStyle = window.getComputedStyle(el);
    const originPosition = originStyle.position;

    if (el[symbol]) {
      el[symbol].remove();
      delete el[symbol];
    }
    if (el[AppSymbol]) {
      el[AppSymbol].unmount();
      delete el[AppSymbol];
    }
    if (!binding.value) {
      return;
    }
    const { loading, text } = convertDirectiveParam(binding.value);

    if (!loading) {
      return;
    }

    const isFullScreen = binding.arg === 'fullScreen';

    const loadingel = document.createElement('div');
    loadingel.classList.add(loadingContainerClass);
    if (isFullScreen) {
      loadingel.classList.add(loadingContainerFullScreenClass);
    }
    const app = createApp(Spin, {
      tip: text,
    });
    app.mount(loadingel);
    if (originPosition === 'static') {
      el.classList.add(relativeClass);
    }

    el[symbol] = loadingel;
    el[AppSymbol] = app;
    el.append(loadingel);
  },
  updated: (el, binding) => {
    el.classList.remove(relativeClass);

    const originStyle = window.getComputedStyle(el);
    const originPosition = originStyle.position;

    if (el[symbol]) {
      el[symbol].remove();
      delete el[symbol];
    }
    if (el[AppSymbol]) {
      el[AppSymbol].unmount();
      delete el[AppSymbol];
    }
    if (!binding.value) {
      return;
    }
    const { loading, text } = convertDirectiveParam(binding.value);

    if (!loading) {
      return;
    }

    const isFullScreen = binding.arg === 'fullScreen';

    const loadingel = document.createElement('div');
    loadingel.classList.add(loadingContainerClass);
    if (isFullScreen) {
      loadingel.classList.add(loadingContainerFullScreenClass);
    }
    const app = createApp(Spin, {
      tip: text,
    });
    app.mount(loadingel);
    if (originPosition === 'static') {
      el.classList.add(relativeClass);
    }

    el[symbol] = loadingel;
    el[AppSymbol] = app;
    el.append(loadingel);
  },
  unmounted: (el) => {
    el.classList.remove(relativeClass);

    if (el[symbol]) {
      el[symbol].remove();
      delete el[symbol];
    }
    if (el[AppSymbol]) {
      el[AppSymbol].unmount();
      delete el[AppSymbol];
    }
  },
};

export default loadingDirective;
