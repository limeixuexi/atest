//后台页面处理
const express = require('express');
const pathLib=require('path');
const fs=require('fs');
const ObjectId=require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient,
    test = require('assert');
  var url = 'mongodb://localhost:27017/node_db';
  var router = express.Router();
  
  router.get('/',(req,res,next)=>{
    MongoClient.connect(url, function(err, db) {
    var col = db.collection('articles');

    if(req.query.act=='mod'){//修改
      col.find({"_id":ObjectId(req.query.id)}).toArray(function(err, mod_data) {
        if(err) throw err;
        col.find({}).sort({_id:-1}).toArray(function(err, data) {
          if(err) throw err;
          res.articles=data;
          db.close();
        });
        res.render('admin.ejs',{articles:res.articles,mod_data:mod_data[0]})
      });
    }else{
      if(req.query.act=='del'){//删除
        col.deleteOne( { "_id" : ObjectId(req.query.id) } ,(err,data)=>{
          if(err) throw err;
          col.find({}).sort({_id:-1}).toArray(function(err, data) {
            if(err) throw err;
            res.articles=data;
            db.close();
            res.render('admin.ejs',{articles:res.articles});
          });
        });
      }else{//初始页面
        col.find({}).sort({_id:-1}).toArray(function(err, data) {
          if(err) throw err;
          res.articles=data;
          db.close();
          res.render('admin.ejs',{articles:res.articles});
        });
      }
    }
  });
});



//管理员上传、更新
router.post('/',(req,res,next)=>{
  if(req.query.act){//更新
    MongoClient.connect(url, function (err, db) {
      var col = db.collection('articles');
      var obj={title:req.body.title
        ,summary:req.body.summary
        ,intro:req.body.intro
        ,director:req.body.director}
      if(req.files[0]){
        var ext=pathLib.parse(req.files[0].originalname).ext;
        var oldPath=req.files[0].path;
        var newPath=req.files[0].path+ext;
        var newFileName=req.files[0].filename+ext;
        obj.url='img/'+newFileName;
        fs.rename(oldPath,newPath,function(err){
          if(err) throw err;
          else console.log("更新图片："+newPath);
      });
      }
      var whereStr = {"_id" : ObjectId(req.body.mod_id)};  // 查询条件
      var updateStr = {$set:  obj };
      // console.log(ObjectId(req.body.mod_id))
      col.update( whereStr ,updateStr,(err,res)=>{
        if (err) throw err;
        console.log("文档更新成功");
        db.close();
      });
    });
  }else{
    if(req.files[0]){//上传
      var ext=pathLib.parse(req.files[0].originalname).ext;
      var oldPath=req.files[0].path;
      var newPath=req.files[0].path+ext;
      var newFileName=req.files[0].filename+ext;
    
    fs.rename(oldPath,newPath,function(err){
      if(err) throw err;
      else console.log("插入图片："+newPath);
    });
    MongoClient.connect(url, function (err, db) {
      var col = db.collection('articles');
      var obj={title:req.body.title
        ,summary:req.body.summary
        ,intro:req.body.intro
        ,director:req.body.director
        ,url:'img/'+newFileName}
      col.insertOne(obj,(err,res)=>{
        if (err) throw err;
        console.log("文档插入成功");
        db.close();
      });
    });
    }
   }
   res.redirect('/admin')//get
});


  module.exports = router;
