<template>
  <!-- 商品列表，拆分组件，根标签 -->
  <div>
    <div class="mask_layer" id="mask_layer" v-show="price_mask_isshow" @click="priceState_set('active')"></div>
      <!--头部  -->
      <nav-header />
      <!-- 面包屑 -->
      <NavBread>
        <span>Goods</span>
      </NavBread>
      <!-- 商品列表 -->
      <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">Sort by:</span>
            <a href="javascript:void(0)" class="default cur">Default</a>
            <a href="javascript:void(0)" class="price" @click="sort">Price <svg class="icon icon-arrow-short">
                <use xlink:href="#icon-arrow-short"></use>
              </svg></a>
            <a href="javascript:void(0)" class="filterby stopPop" @click="price_menu">Filter by</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':price_menu_isshow}">
              <!-- 添加class为 filterby-show出现菜单 -->
              <dl class="filter-price">
                <dt>Price:</dt>
                <dd v-bind:class="{'cur':priceState_all=='active'}" @click="priceState_set('active')"><a href="javascript:void(0)">All</a></dd>
                <dd  v-for="(item,index) in PriceFilter" :key="index" v-bind:class="{'cur':priceState_all==index}" @click="priceState_set(index)">
                  <a href="javascript:void(0)">{{item.startPrice}} - {{item.endPrice}}</a>
                </dd>
              </dl>
            </div>
            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul>
                  <li v-for="(item,index) in goodslist" :key="index">
                    <div class="pic">
                      <a href="#">
                        <!-- <img v-bind:src="'/static/'+item.productImg" alt=""> -->
                        <img v-lazy="item.productImg">
                      </a>
                    </div>
                    <div class="main">
                      <div class="name">{{item.productName}}</div>
                      <div class="price">{{item.salePrice}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
                <div class="goods_load" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
                  <img src="../../static/loading/loading-cubes.svg" v-show="loadingSvg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 没有登录模态框：定义自定义事件，通过这个事件来进行通信 -->
      <Modal v-bind:mdShow="mdShow" v-on:close="closeModal">
        <p slot='message' style="font-size: 16px;">请登录，否则无法加入购物车！</p>
        <div slot="btnGroup">
          <a class="btn btn--m" @click="closeModal" style="float: right;">关闭</a>
        </div>
      </Modal>
      <!-- 登录成功添加购物对话框 -->
       <Modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
         <p slot='message' style="font-size: 16px;">商品成功加入购物车！</p>
         <div slot="btnGroup">
           <a class="btn btn--m" @click="mdShowCart=false" style="float: left;" >继续购物</a>
           <router-link class="btn btn--m" to="/cart" style="float: right;">查看购物车</router-link>
         </div>
       </Modal>
      <!-- 底部 -->
      <nav-footer  />
  </div>
</template>

<script>
  import './../assets/css/base.css'  // 导入样式，不需要名称
  import '@/assets/css/product.css'
  import '@/assets/css/checkout.css'
  import '@/assets/css/login.css'
  import NavHeader from '@/components/Header'   // 头部
  import NavFooter from '@/components/NavFooter.vue'   //底部
  import NavBread from '@/components/NavBread.vue'   // 面包屑
  import axios from 'axios'   // 导入axios
  import Modal from '../components/Modal.vue'   // 引入模态框
  export default {
    data(){
      return{
        mdShowCart:false,    // 默认登录成功后，添加到购物车模态框为隐藏
        mdShow:false,   // 默认-没有登录，Modal为隐藏
        loadingSvg:false,   //默认隐藏loadingsvg
        goodslist:[],  // 遍历的商品列表数据
        priceState_all:'active',    // 定义价格状态
        price_menu_isshow: false,  // 手机端价格菜单是否显示
        price_mask_isshow:false,   //价格菜单遮罩层是否显示
        //分页
        sortFlag:true,   // 升序开关
        page:1,   // 页码，默认是第一页
        pageSize:4,  // 每页显示的条数
        // 是否进行下一页
        busy:true,   // 默认禁止下一页：true--禁止，false可以下一页
        PriceFilter:[
          {startPrice:'0.00',endPrice:'100.00'},
          {startPrice:'100.00',endPrice:'500.00'},
          {startPrice:'500.00',endPrice:'1000.00'},
          {startPrice:'1000.00',endPrice:'2000.00'},
          {startPrice:'2000.00',endPrice:'4000.00'},
          {startPrice:'4000.00',endPrice:'10000.00'}
        ]
      }
    },
    components:{
      NavHeader,  // 注册组件
      NavFooter,
      NavBread,
      Modal   // 映射模态框组件
    },
    mounted(){
      this.getGoodslist()   // 调用方法，去请求数据
    },
    methods:{
      // 关闭添加商品没有登录对话框
      closeModal(){
        this.mdShow=false
        this.mdShowCart=false
      },
      // 升降序
      sort(){
        this.page=1
        this.sortFlag=!this.sortFlag
        this.getGoodslist()
      },
      // 添加到购物车
      addCart(productId){
        //console.log(productId)
        axios.post('/goods/addCart',{
          productId:productId
        }).then(res=>{
           console.log(res.data)
           // alert(res.data.status=='0'?'产品添加成功':'产品添加失败')
           //res.data.status=='0'?alert('产品添加成功'):this.mdShow=true
           //res.data.status=='0'?this.mdShowCart=true:this.mdShow=true
           // 当this.mdShow=true时，显示模态框，但是模态框并不知道这个值用意
           if (res.data.status=='0') {
             this.mdShowCart=true
             this.$store.commit('updateCartCount')
           } else {
             this.mdShow=true
           }
        })
      },
      loadMore(){  // 分页插件触发的事件   //5 可以触发事件了，因为这时busy为fasle
        //console.log('1111')
        setTimeout(()=>{
          this.page++
          this.getGoodslist(true)  // true决定数据是否累加，也就是向下滚动-第二页，第一页的数据是否保留
        },500)
      },
      priceState_set(index){   // 手机端价格菜单点击价格时消失
        //点击价格过滤，每次触发该方法，这个方法中一个是手状态和pc状态，发生数据变化，必须从第一页开始显示
        this.priceState_all=index  // 手机和pc都在使用给状态
        this.page=1  // 初始化页码
        this.getGoodslist()

        this.price_menu_isshow=false  // 手机端菜单
        this.price_mask_isshow=false   // 手机端遮罩
      },
      price_menu(){   // 手机端菜单显示
        this.price_menu_isshow=true
        this.price_mask_isshow=true
      },
      getGoodslist(flag){
        this.loadingSvg=true  // 当调用getGoodlist时会显示加载动画
        console.log(flag)   // 未定义
        //axios.get('http://localhost:3000/goods').then(res=>{   // CORS
        var param={   // 定义渲染产品列表的参数
          priceLevel:this.priceState_all,  // 点击的状态传递到后台
          page:this.page,
          pageSize:this.pageSize,
          sort:this.sortFlag?1:-1  // -1降序 1 升序
        }
        axios.get('/goods/list',{params:param}).then(res=>{   // s代表多个
            //console.log(res)
            if(res.data.status=='0'){
              this.loadingSvg=false  // 数据加载成功隐藏svg
              if(flag){   // 2 如果没有滑动鼠标，undefined，会运行else
                          // 6 这是flag为true，执行goodslist数据累加,原来的数据+现在的数据
                  this.goodslist=this.goodslist.concat(res.data.result.list)
                  if(res.data.result.count==0){
                          //7 当数据没有的时候
                      this.busy=true
                  }else{
                      this.busy=false
                  }
              }else{
                this.goodslist=res.data.result.list  //3 数据加载的第一页数据，busy为true，禁止向下滑动
                this.busy=false  //4 可以向下滑动
              }
            }else{
               this.goodslist=[]
            }
        })
      }
    }
  }
</script>

<style>
  .mask_layer{ width: 100%; height: 100%; background-color: rgba(0,0,0,0.3); position: absolute; z-index: 1;}
  .goods_load{ height: 100px; text-align: center; line-height: 100px;}
</style>
