import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  routes: [
    {
      path: "/",
      name: "Index",
      component: () => import("@/views/Index.vue")
    },
    {
      path: "/comments",
      name: "Comments",
      component: () => import("@/views/Comments.vue")
    }
  ],
  history: createWebHashHistory()
});

export default router;
