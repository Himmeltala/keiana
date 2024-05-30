import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  routes: [
    {
      path: "/",
      name: "首页",
      component: () => import("@/views/Home.vue")
    },
    {
      path: "/comments",
      name: "备注",
      component: () => import("@/views/Comments.vue")
    },
    {
      path: "/infographic",
      name: "统计",
      component: () => import("@/views/Infographic.vue")
    }
  ],
  history: createWebHashHistory()
});

export default router;
