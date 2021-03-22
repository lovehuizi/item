// 引入mongoose
var mongoose=require("mongoose")
// 创建模型schema-约束
let Schema=mongoose.Schema;
let productSchema = new Schema({   // 这里一定和数据库文档一一对应
    "productId" : String,
    "productName" : String,
    "salePrice" : Number,
    "productImg" : String,
    "productNum":Number,
    "checked":String
})
// 创建模型对象并暴露
module.exports=mongoose.model('goods',productSchema)   // 集合-模型
// goods集合名称 productSchema模型
