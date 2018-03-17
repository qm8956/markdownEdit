import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import MdEdit from '@/components/MdEdit'
import IndexedDB from '@/plugins/IndexedDB'

Vue.use(Router)
Vue.use(mavonEditor)
Vue.use(IndexedDB)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MdEdit',
      component: MdEdit
    },
    {
      path: '/init',
      name: 'HelloWorld',
      component: HelloWorld
    }
  ]
})
