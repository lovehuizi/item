<template>
    <div>
      <!-- 头 -->
      <NavHeader></NavHeader>
      <div class="container">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>check out</span></h2>
        </div>
        <!-- 进度条 -->
        <div class="check-step">
          <ul>
            <li class="cur"><span>Confirm</span> address</li>
            <li class="cur"><span>View your</span> order</li>
            <li class="cur"><span>Make</span> payment</li>
            <li class="cur"><span>Order</span> confirmation</li>
          </ul>
        </div>

        <div class="order-create">
          <div class="order-create-pic"><img src="/static/ok-2.png" alt=""></div>
          <div class="order-create-main">
            <h3>Congratulations! <br>Your order is under processing!</h3>
            <p>
              <span>Order ID：{{orderId}}</span>
              <span>Order total：{{orderTotal}}</span>
            </p>
            <div class="order-create-btn-wrap">
              <div class="btn-l-wrap">
                <router-link class="btn btn--m" to='/cart'>Cart List</router-link>
              </div>
              <div class="btn-r-wrap">
                <router-link class="btn btn--m" to="/">Goods List</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 底部 -->
      <NavFooter></NavFooter>
    </div>
</template>
<script>
  import NavHeader from '@/components/Header'   // 头部
  import NavFooter from '@/components/NavFooter.vue'   //底部
  import axios from 'axios'   // 导入axios
    export default{
        data(){
            return{
              orderId:'',   // 订单id
              orderTotal:0  // 总价
            }
        },
        mounted() {
          this.orderInfo()
          this.init()
        },
        methods:{
          orderInfo(){
            var orderId=this.$route.query.orderId
            axios.get('/users/orderTotal',{params:{
              orderId:orderId
            }}).then(res=>{
              // console.log(res)
              this.orderId=orderId
              this.orderTotal=res.data.result
            })
          },
          init(){
            axios.get('/users/orderClear').then(res=>{
              if(res.data.status=='0'){
                 console.log('ok') 
              }
            })
          }
        },
        components:{
          NavHeader,  // 注册组件
          NavFooter
        }
    }
</script>
