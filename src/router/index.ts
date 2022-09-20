import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  // {
  //   path: Pages.home,
  //   component: Home,
  // },
];

const base = '/';
export const router = createRouter({
  history: createWebHistory(base),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((_) => _.meta.needLogin === true)) {
    // 简单的鉴权校验; 设置route.meta.needLogin 对每个页面设置是否需要登陆;
    next();
  } else {
    next();
  }
});
