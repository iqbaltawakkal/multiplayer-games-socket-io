import Vue from "vue";
import Router from "vue-router";

import Landing from "../pages/Landing.vue";
import Games from "../pages/Games.vue";
import TarikTambang from "../components/games/TarikTambang.vue";
import Quiz from "../components/games/Quiz.vue";
import store from "../store/store.js";

Vue.use(Router);

const routes = [
  { path: "/", component: Landing },
  {
    path: "/games",
    name: "games",
    component: Games,
    beforeEnter: (to, from, next) => {
      if (store.state.user.name !== "") {
        next();
      } else {
        next("/");
      }
    },
    children: [
      {
        path: "tarik-tambang",
        component: TarikTambang
      },
      {
        path: "quiz",
        component: Quiz
      }
    ]
  },
  { path: "*", redirect: "/" }
];

export default new Router({
  routes
});
