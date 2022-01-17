<template>
  <svg :class="[upcaseClass, iconId, 'IconCommon', disabled ? 'iconDisabled' : '']" :style="computedStyle" aria-hidden="true">
    <use :xlink:href="`#${iconId}`"></use>
  </svg>
</template>
<script setup lang="ts">
import { toRef, computed } from 'vue';

type TIcon = {
  /** Icon的id, 从iconfont获取 */
  iconId: string;
  /** 填充的颜色 */
  fill?: string;
  /** width和height的取值 */
  size?: number | string;
  /** 是否置灰 */
  disabled?: boolean;
};

const props = defineProps<TIcon>();

const iconId = toRef(props, 'iconId');
const fill = toRef(props, 'fill');

const upcaseClass = computed(() => {
  return iconId.value
    .split('-')
    .filter((_) => _)
    .map((_) => {
      const firstLetter = _[0].toUpperCase();
      return firstLetter + _.slice(1);
    })
    .join('');
});
// 默认值
const computedStyle = computed(() => `width: ${props.size}px;height:${props.size}px;fill:${fill.value}`);
</script>
<style lang="scss">
.IconCommon {
  fill: currentColor;
  outline: none;
  width: 1em;
  height: 1em;
  &.iconDisabled {
    filter: opacity(0.5);
    cursor: not-allowed !important;
  }
}
</style>
