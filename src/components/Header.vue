<template>
  <div id="app">
    <header class="header">
      <symbol id="icon-cart" viewBox="0 0 38 32">
        <title>cart</title>
        <path class="path1"
          d="M37.759 0h-4.133c-0.733 0.004-1.337 0.549-1.434 1.255l-0.546 4.342c-0.081 0.484-0.496 0.849-0.997 0.849-0.005 0-0.009-0-0.014-0h-27.604c-0.003 0-0.007-0-0.011-0-1.674 0-3.031 1.357-3.031 3.031 0 0.34 0.056 0.666 0.159 0.971l2.52 8.062c0.385 1.194 1.486 2.043 2.785 2.043 0.126 0 0.25-0.008 0.372-0.023l22.983 0.002c0.515 0.131 0.626 0.768 0.626 1.283 0.005 0.044 0.009 0.095 0.009 0.146 0 0.501-0.294 0.933-0.718 1.134l-22.439 0.003c-0.354 0-0.642 0.287-0.642 0.642s0.287 0.642 0.642 0.642h22.745l0.131-0.071c0.919-0.392 1.551-1.287 1.551-2.33 0-0.058-0.002-0.116-0.006-0.173 0.021-0.108 0.033-0.24 0.033-0.376 0-1.072-0.732-1.973-1.724-2.23l-23.357-0.004c-0.063 0.008-0.135 0.013-0.209 0.013-0.719 0-1.332-0.455-1.566-1.093l-2.53-8.095c-0.048-0.154-0.076-0.332-0.076-0.515 0-0.973 0.782-1.764 1.752-1.778h27.657c1.159-0.004 2.112-0.883 2.232-2.011l0.547-4.345c0.010-0.083 0.078-0.147 0.161-0.152l4.133-0c0.354 0 0.642-0.287 0.642-0.642s-0.287-0.642-0.642-0.642z">
        </path>
        <path class="path2"
          d="M31.323 9.69c-0.022-0.003-0.048-0.004-0.074-0.004-0.328 0-0.598 0.248-0.633 0.567l-0.809 7.268c-0.003 0.022-0.004 0.048-0.004 0.074 0 0.328 0.248 0.598 0.567 0.633l0.074 0c0.001 0 0.003 0 0.004 0 0.327 0 0.596-0.246 0.632-0.563l0.809-7.268c0.003-0.022 0.004-0.048 0.004-0.074 0-0.328-0.248-0.598-0.567-0.633z">
        </path>
        <path class="path3"
          d="M27.514 25.594c-1.769 0-3.203 1.434-3.203 3.203s1.434 3.203 3.203 3.203c1.769 0 3.203-1.434 3.203-3.203s-1.434-3.203-3.203-3.203zM27.514 30.717c-1.060 0-1.92-0.86-1.92-1.92s0.86-1.92 1.92-1.92c1.060 0 1.92 0.86 1.92 1.92s-0.86 1.92-1.92 1.92z">
        </path>
        <path class="path4"
          d="M9.599 25.594c-1.769 0-3.203 1.434-3.203 3.203s1.434 3.203 3.203 3.203c1.769 0 3.203-1.434 3.203-3.203s-1.434-3.203-3.203-3.203zM9.599 30.717c-1.060 0-1.92-0.86-1.92-1.92s0.86-1.92 1.92-1.92c1.060 0 1.92 0.86 1.92 1.92s-0.86 1.92-1.92 1.92z">
        </path>
      </symbol>
      <div class="navbar">
        <div class="navbar-left-container">
          <a href="/">
            <img class="navbar-brand-logo" src="/static/logo.png"></a>
        </div>
        <div class="navbar-right-container" style="display: flex;">
          <div class="navbar-menu-container">
            <!--<a href="/" class="navbar-link">我的账户</a>-->
            <span class="navbar-link"></span>
            <a href="javascript:void(0)" class="navbar-link" @click="login_reg" v-if="!nickName">Login</a>
            <span v-text="nickName" v-if="nickName"></span>
            <a href="javascript:void(0)" class="navbar-link" v-if="nickName" @click="Logout">Logout</a>

            <div class="navbar-cart-container">
              <span class="navbar-cart-count" v-if="cartCount > 0">{{cartCount}}</span>
              <a class="navbar-link navbar-cart-link" href="/#/cart">
                <svg class="navbar-cart-logo">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-cart"></use>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      <!-- 登录 -->
      <!-- 添加一个md-show，就会显示模态框 -->
      <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show':loginModalFlag}">
        <div class="md-modal-inner">
          <div class="md-top">
            <div class="md-title">Login in</div>
            <button class="md-close" @click="loginModalFlag=false">Close</button>
          </div>
          <div class="md-content">
            <div class="confirm-tips">
              <div class="error-wrap">
                <span class="error error-show" v-show="errorTip">用户名或者密码错误</span>
                <span class="error error-show" v-show="errorTip2">此用户名已被注册</span>
                <span class="error error-show" v-show="errorTip3">用户名或密码不能为空</span>
              </div>
              <ul>
                <li class="regi_form_input">
                  <i class="icon IconPeople"></i>
                  <input v-model="userName" type="text" tabindex="1" name="loginname"
                    class="regi_login_input regi_login_input_left" placeholder="User Name" data-type="loginname" />
                </li>
                <li class="regi_form_input noMargin">
                  <i class="icon IconPwd"></i>
                  <input v-model="userPwd" type="password" tabindex="2" name="password"
                    class="regi_login_input regi_login_input_left login-input-no input_text" placeholder="Password" />
                </li>
              </ul>
            </div>
            <div class="login-wrap">
              <a href="javascript:;" class="btn-login" @click="reg">注册</a>
              <a href="javascript:;" class="btn-login" @click="login">登 录</a>
            </div>
          </div>
        </div>
      </div>
      <!-- 遮罩层 -->
      <div class="md-overlay" v-if="loginModalFlag" @click="loginModalFlag=false"></div>

    </header>
  </div>
</template>
<script>
  import axios from 'axios'
  export default {
    data() {
      return {
        userName: '',
        userPwd: '',
        errorTip: false, // 登录错误，是否显示这个错误，默认不显示
        loginModalFlag: false, // 默认关闭登录遮罩层
        errorTip2: false,
        errorTip3: false,
        //nickName:'' // 登录后的昵称,如果用vuex，这个变量没什么用了
      }
    },
    computed: {
      nickName() { // 实时的获取vuex中state的nickName
        return this.$store.state.nickName
      },
      cartCount() {
        return this.$store.state.cartCount
      }
    },
    mounted() { // 生命周期
      this.checkLogin() // 调用方法-检测用户是否登录
    },
    methods: { // name 和 id 都不能重复
      // 注册按钮
      reg() {
        if (this.userName == '' || this.userPwd == '') {
          this.errorTip3 = true;
        } else {
          this.errorTip3 = false;

          console.log(this.userName);
          console.log(this.userPwd);
          var id = '100' + parseInt(Math.random() * 10000) * 100;

          axios.get('/users/getUserName', {
            params: {
              id: id,
              name: this.userName,
              pwd: this.userPwd
            }
          }).then(res => {
            console.log(res);
            if (res.data.status == '0') {
              this.loginModalFlag = false;
              this.userName = ''
              this.userPwd = ''

              this.$message({
                showClose: true,
                message: '恭喜你，注册成功~',
                type: 'success'
              });
            }
            if (res.data.status == '2') {
              this.errorTip2 = true;
            }

          })



        }
      },
      login_reg() {
        this.userName = ''
        this.userPwd = ''
        this.loginModalFlag = true
        this.errorTip2 = false
        this.errorTip3 = false
        

      },
      //购物车数量
      getCartCount() {
        axios.post('/users/getCartCount').then(res => {
          if (res.data.status == '0') {
            this.$store.commit('initCartCount', res.data.result)

          }
        })
      },
      // 用户登录检测
      checkLogin() {
        axios.get('/users/checkLogin').then(res => {

          if (res.data.status == '0') { // 成功
            // this.nickName=res.data.result
            this.$store.commit('updateUserInfo', res.data.result)
            this.getCartCount()
          }
        })
      },
      // 登录
      login() {
        if (this.userName == '' || this.userPwd == '') {
          this.errorTip = true
          return false
        }
        axios.post('/users/login', {
          userName: this.userName, // 传值
          userPwd: this.userPwd
        }).then(r => {
          let res = r.data // 返回的值
          if (res.status == '0') { // 状态码 0 成功
            this.errorTip = false

            this.loginModalFlag = false // 登录成功关闭遮罩层
            //  this.nickName=res.result.userName  // 登录成功后，昵称赋值
            this.$store.commit('updateUserInfo', res.result.userName)
            this.getCartCount()

            this.$message({
              showClose: true,
              message: '恭喜你，登录成功~',
              type: 'success'
            });
          } else {
            //
            this.errorTip = true
          }
        })
      },
      Logout() {

        // 退出登录
        axios.post('/users/logout').then(res => {
          if (res.data.status == '0') {
            //  this.nickName=''
            this.$store.commit('updateUserInfo', '')
            this.$store.commit('initCartCount', 0)
          }
        })
      }
    }
  }

</script>



<style>
  .md-content .btn-login {
    display: block;
    width: 160px;
    float: left;
    margin-left: 36px;
    height: 38px;
    line-height: 38px;
    border: 2px solid #009de6;
    background: #009de6;
    color: #fff;
    font-size: 18px;
    text-align: center;
  }

</style>
