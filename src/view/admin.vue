<template>
 <div>
   <router-link to="/Additem">添加商品</router-link>
   <router-link to="/Liushui"> 流水</router-link>
    
     <router-view></router-view>
 </div>
</template>

<script>
 export default {
   data () {
     return {

     }
   },
   components: {

   },
 }
</script>

<style>
  p{
    width: 666px;
    height: 300px;
    font-size: 100px;
    text-align: center;
    margin: 150px auto;
  }
 
</style>
