import Vue from "vue"
import Router from "vue-router"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/",
      name: "index",
      component: () => import("@/view/index/index.vue"),
      children: [
        {
          path: "dayPlan",
          component: () => import("@/view/dayPlan/dayPlan.vue"),
          meta: {
            keepAlive: false
          },
          children: [
            {
              path: "list",
              component: () => import("@/view/dayPlanList/dayPlanList.vue"),
              meta: {
                keepAlive: false
              }
            },
            {
              path: "edit",
              component: () => import("@/view/dayPlanEdit/dayPlanEdit.vue"),
              meta: {
                keepAlive: false
              }
            }
          ]
        },
        {
          path: "statistics",
          component: () => import("@/view/statistics/statistics.vue"),
          meta: {
            keepAlive: false
          }
        }
      ]
    },
    {
      path: "*",
      redirect: "/"
    }
  ]
})
