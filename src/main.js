// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router' // index.js
import lazyload from 'vue-lazyload' // 导入懒加载
import infiniteScroll from 'vue-infinite-scroll' // 导入分页
import { currency } from './util/currency.js' // 注意 {函数名}，货币格式化--全局
import Vuex from 'vuex' // 引入了vuex
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.use(infiniteScroll) // 使用
Vue.use(Vuex) // 使用vuex
const store = new Vuex.Store({
    state: { // vuex中的数据
        nickName: '', // 登录名称
        cartCount: 0 // 购物车数量
    },
    mutations: {
        updateUserInfo(state, nickName) { // 更新用户名称
            state.nickName = nickName
        },
        updateCartCount(state, cartCount) { // 购物车商品数量
            state.cartCount += cartCount
        },
        initCartCount(state, cartCount) { // 购物车商品数量初始化
            state.cartCount = cartCount
        },
    }
})
Vue.use(lazyload, { // 挂载+配置
    loading: "/static/loading/loading-bubbles.svg"
})
Vue.filter('c', currency) // 定义成全局的过滤器
    /* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store, // 将创建的vuex实例引入到vue实例中，所有组件都可以使用
    components: { App },
    template: '<App/>'
})
