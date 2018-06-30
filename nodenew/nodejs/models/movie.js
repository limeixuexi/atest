//编写编译模型
var mongoose=require('mongoose')
//引入模式文件
var MovieSchema=require('../schema/movie')
//编译生成Movie模型
var Movie=mongoose.model('Movie',MovieSchema) 
//把构造的编译模型暴露
module.exports=Movie