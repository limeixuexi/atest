var formidable = require('formidable');
var db=require("../models/db.js");
var md5 = require("../models/md5.js");
var ObjectId=require('mongodb').ObjectID;

//lxm
//加载数据库
var mongoose=require('mongoose');
//声明数据模型Movie
var Movie=require('../models/movie');
var _ = require('underscore');
var bodyParser=require('body-parser');
// var path=require('path');
//创建传入数据库
mongoose.connect('mongodb://localhost/movietest');
  exports.moviesee=function(req,res){
  Movie.fetch(function(err,movies){
    if(err){
      console.log(err)
    }
      res.render('seemovie.jade',{
        movies:movies
      })
  })
  } 
  exports.advedio=function(req,res){
  var id=req.params.id
  
  Movie.findById(id,function(err,movie){
  res.render('vedio.ejs',{
    title:'播放电影页' ,
    movie:movie
    })
  })
}
exports.adhoutai=function(req,res){
  res.render('houtai.jade',{
    title:'后台录入电影页',
    movie:{
      title:'',
      poster:'',  
      doctor:'',
      country:'',
      language:'',
      summary:'',
      address:''
    }
  })
}
//更新电影路由houtai get movie

exports.adupdate=function(req,res){
  var id=req.params.id
  console.log(id)
  if(id){
    Movie.findById(id,function(err,movie){
      res.render('houtai.jade',{
        title:'后台更新页',
        movie:movie
      })
    })
  }
}
//表单提交的路由
//admin post movie
exports.adhoutainew=function(req,res){
//   console.log(req.body.movie);
  //console.log(_id);
  var id=req.body.movie._id
  var movieObj=req.body.movie
  //声明一个movie对象
  var _movie
  //判断是否是新录入的电影
  if(id!=='undefined'){
    Movie.findById(id,function(err,movie){
      if(err){
        console.log(err)
      }
      _movie= _.extend(movie,movieObj)
      _movie.save(function(err,movie){
        if(err){
          console.log(err)
        } 
        //电影更新存储成功后重定向到电影播放页面
        res.redirect('/admin/vedio/'+ movie._id)
      })
    })
  }
  //电影为新加入的电影
  else{
    _movie=new Movie({
      doctor:movieObj.doctor,
      poster:movieObj.poster,
      title:movieObj.title,
      country:movieObj.country,
      language:movieObj.language,
      summary:movieObj.summary,
      address:movieObj.address
    })
     _movie.save(function(err,movie){
        if(err){
          console.log(err)
        } 
         res.redirect('/admin/vedio/'+ movie._id)
     })
  }
}
exports.adlist=function(req,res){
  Movie.fetch(function(err,movies){
    if(err){
      console.log(err)
    }
    res.render('list.jade',{
    title:'电影列表页',
    movies:movies
    })
  })
}
//删除电影路由

exports.addelite=function(req,res){
  var id=req.query.id
//   console.log(id)
  if(id){
    Movie.remove({_id:id},function(err,movie){
      if(err){
        console.log(err)
      }
      else{
        res.json({success:1})
      }
    })
  }
}



//lzw
exports.showIndex = function(req,res,next){ 
        res.render("pinglun",{
        "login":req.session.login=="1"?true:false,
        "username":req.session.login=="1"?req.session.username:""     
    });
  
};

exports.showRegist = function(req,res,next){
    res.render("regist");
};

exports.doRegist = function(req,res,next){
    var form = new formidable.IncomingForm();
    form .parse(req ,function(err,fields,files){
        var username = fields.username;
        var password = fields.password;
        password = md5(md5(password)+"lzw");
        db.find("users",{
            "username":username
        },function(err,result){
            if(err){
                res.send("-3");//服务器错误
                return;
            }
            if(result.length!=0){
                res.send("-1");//占用
                return;
            }
            db.insertOne("users",{
                "username":username,
                "password":password,
            },function(err,result){
                if(err){
                    res.send("-3");
                    return;
                }
                req.session.login ="1";
                req.session.username=username;
                res.send("1");//成功，写入session 
            });
        });
   });
};

exports.showLogin = function(req,res,next){
    res.render("login");
};

exports.doLogin = function(req,res,next){
    var form = new formidable.IncomingForm();
    form .parse(req ,function(err,fields,files){
        var username = fields.username;
        var password = fields.password;
        var afterpw = md5(md5(password)+"lzw");
        db.find("users",{"username":username},function(err,result){
            if(err){
                res.send("-5");
                return;
            }
            if(result.length==0){
                res.send("-1");//不存在
                return;
            }
            if(afterpw==result[0].password){
                req.session.login="1";
                req.session.username=username;
                res.send("1");
                
            }else{
                res.send("-2");//密码错误
                return;
            }
        });
        console.log(username,password);
   });
};


exports.doPostshow = function(req,res,next){
    if(req.session.login!="1"){
        res.end("这个页面要求登录");
        return;
    }
    var username = req.session.username;
    var form = new formidable.IncomingForm();
    
    form.parse(req ,function(err,fields,files){
        var text = fields.text;    
        console.log(text);
            db.insertOne("posts",{
                "username":username,
                "datetime":new Date(),
                "text":text
            },function(err,result){
                if(err){
                    res.send("-3");
                    return;
                }
                res.send("1");//成功，写入session 
        });
   });
};

exports.getall= function(req,res,next){
    var page = req.query.page;
    db.find("posts",{},{"pageamount":5,"page":page,"sort":{"datetime":-1}},function(err,result){
        res.json({"r":result});
    });
};

exports.getplamount=function(req,res,next){
    db.getAllCount("posts",function(count){
        res.send(count.toString());
    });
};

exports.sendcontect = function(req,res,next){
     res.render("contect");
 };
exports.dotijiao = function(req,res,text){
    var form = new formidable.IncomingForm();

    form.parse(req,function(err,fields){
        db.insertOne("liuyanben",{
            "name":fields.name,
            "email":fields.email,
            "phone":fields.phone,
            "message":fields.message
        },function(err,result){
            if(err){
                res.send({"result":-1});
                return;
            }
            res.send({"result":1});
        })
        console.log("收到请求了"+fields.name+fields.email+fields.phone+fields.message);
    });
};

exports.doshanchu = function(req,res,next){
    var id = req.query.id;
    var username = req.session.username;
    db.find("posts",{"_id":ObjectId(id)},function(err,result){
        if(username==result[0].username){
            db.deleteMany("posts",{"_id":ObjectId(id)},
            function(err,result){
                res.redirect("/showpl");
            });
        }
        else{
            res.redirect("/showpl");
            return;
        }
    });
} 
