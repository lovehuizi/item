// 引入mongoose
var mongoose=require("mongoose")
var userSchema=new mongoose.Schema({   // 认真的核对三遍
  "userId":String,
  "userName":String,
  "userPwd":String,
  "orderList":Array,
  "cartList":[
    {
       "productImg" : String,
       "salePrice" : Number,
       "productName" : String,
       "productId" : String,
       "productNum" : Number,
       "checked" : String
    }
  ],
  "addressList":[
    {
      "addressId" : String,
       "userName" : String,
       "streetName" : String,
       "postCode" : String,
       "tel" : String,
       "isDefault" : Boolean
     }  
  ]
})
module.exports=mongoose.model('user',userSchema)   // 集合-模型
