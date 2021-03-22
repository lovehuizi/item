import Vue from 'vue'
import Router from 'vue-router'
import Goodslist from '@/view/Goodslist.vue'    // 导入组件
import Cart from '@/view/Cart'   // 导入购物车组件
import Address from '@/view/Address.vue'
import orderConfirm from '@/view/OrderConfirm.vue'
import OrderSuccess from '@/view/OrderSuccess.vue'
import  Additem from '@/view/Additem.vue'
import  Liushui from '@/view/Liushui.vue'
import  admin from '@/view/admin.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Goodslist',
      component: Goodslist,
    },
    {
      path: '/cart',
      name: 'Cart',
      component: Cart
    },
    {
      path: '/address',
      name: 'Address',
      component: Address
    },
    {
      path: '/orderConfirm',
      name: 'orderConfirm',
      component: orderConfirm
    },
    {
      path: '/OrderSuccess',
      name: 'OrderSuccess',
      component: OrderSuccess
    },

    {
      path: '/admin',
      name: 'admin',
      component: admin,
      children: [
        {
          path: '/Additem',
          name: 'Additem',
          component: Additem
        },
        {
          path: '/Liushui',
          name: 'Liushui',
          component: Liushui
        },
      ]
    },
  ]
})
