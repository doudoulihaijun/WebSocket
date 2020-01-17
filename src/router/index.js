import Vue from 'vue'
import Router from 'vue-router'
import liaotianshi from '@/components/liaotianshi'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'liaotianshi',
      component: liaotianshi
    }
  ]
})
