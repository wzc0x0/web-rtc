import Vue from "vue";
import VueRouter from "vue-router";
import App from "./view/App.vue";

const router = new VueRouter({
  routes: [
    {
      path: "/server",
      component: () => import("./view/server.vue"),
    },
    {
      path: "/client",
      component: () => import("./view/client.vue"),
    },
  ],
});

new Vue({
  el: "#app",
  router,
  render: (h) => h(App),
});
