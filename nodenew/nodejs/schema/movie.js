//模式编写
var mongoose=require('mongoose');
var MovieSchema=new mongoose.Schema({
    
    title:String,
    poster:String,
    doctor:String,
    country:String,
    language:String,
    
    summary:String,
    address:String,
    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }
    
})
//通过save方法将数据保存到数据库
MovieSchema.pre('save',function(next){
    if(this.isNew){
        this.meta.createAt=this.updateAt=Date.now()
    }
    else{
        this.meta.updateAt=Date.now()
    }
    next()
})
//获取静态资源
MovieSchema.statics={
    //取出目前数据库里的数据
    fetch:function(cb){
        return this
        .find({})
        .sort('meta.updateAt')
        .exec(cb)
    },
    //查询单条数据
    findById:function(id,cb){
        return this
        .findOne({"_id":id}) 
        .exec(cb)
    }
}

module.exports=MovieSchema