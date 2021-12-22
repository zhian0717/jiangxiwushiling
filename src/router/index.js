import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const router = new Router({
    routes: [
      {
        path: "/",
        redirect: "/home",
      },
      {
        path: "/PublishPage",
        name: "PublishPage",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/components/PublishPage1.0.vue"),
        meta: { title: "业务系统导航" }
      }
    ]
  });
  
  export default router;