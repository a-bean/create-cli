import { Directive } from 'vue';
import { off, on } from 'evtd';

const isfunction = (param: unknown) => typeof param === 'function';

const symbol = Symbol('clickOutside');
type TValType = () => void;
const handleClick = (fn: TValType) => () => {
  fn();
};

type CustomElement = HTMLElement & { [symbol]?: TValType };

const clickOutsideDirective: Directive<CustomElement, TValType> = {
  mounted: (el, binding) => {
    if (!isfunction(binding.value)) {
      console.warn('v-clickoutside binding should be function');
      return;
    }
    const fn = handleClick(binding.value);
    el[symbol] = fn;
    on('clickoutside', el, fn);
  },
  updated: (el, binding) => {
    let fn: TValType | undefined = el[symbol];
    if (fn) {
      off('clickoutside', el, fn);
    }
    if (!isfunction(binding.value)) {
      console.warn('v-clickoutside binding should be function');
      return;
    }
    fn = handleClick(binding.value);
    el[symbol] = fn;
    on('clickoutside', el, fn);
  },
  unmounted: (el) => {
    const fn: TValType | undefined = el[symbol];
    if (fn) {
      off('clickoutside', el, fn);
    }
  },
};

export default clickOutsideDirective;
