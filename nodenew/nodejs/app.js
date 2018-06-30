var express=require("express");
var app=express();
var session = require('express-session');
const bodyParser=require('body-parser');
const multer=require('multer');
const multerObj=multer({dest: './public/img'});
const path = require('path');

var router = require("./router/router.js");
//使用session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.set("view engine","ejs");
//静态页面
app.use(express.static("./public"));
//路由表
app.get("/showpl",router.showIndex);
app.get("/regist",router.showRegist);
app.post("/doregist",router.doRegist);
app.get("/login",router.showLogin);
app.post("/dologin",router.doLogin);
app.post("/postshow",router.doPostshow);
app.get("/getall",router.getall);
app.get("/getplamount",router.getplamount);
app.get("/contect",router.sendcontect);
app.post("/tijiao",router.dotijiao);
app.get("/shanchu",router.doshanchu);




//lxm
app.use(require('body-parser').urlencoded({extended:true}));
//传入更新本地时间需要加载的 
 app.locals.moment=require('moment');
//测试jade修改
app.get('/moviesee',router.moviesee);
// 加入视图文件包括vedio.jade,houtai.jade,list.jade,用路由获得
app.get('/admin/vedio/:id',router.advedio);
app.get('/admin/houtai',router.adhoutai);
//更新电影路由houtai get movie
app.get('/admin/update/:id',router.adupdate);
//表单提交的路由
//admin post movie
app.post('/admin/houtai/new',router.adhoutainew);
//电影列表页
app.get('/admin/list',router.adlist);
//删除电影路由
app.delete('/admin/list',router.addelite);


//zbz
app.use(multerObj.any());
// server.set('views', path.join(__dirname, 'views'));
//路由
//首页
app.use('/',require('./routes/web/index'));
app.use('/index',require('./routes/web/index'));
//管理员
app.use('/admin',require('./routes/admin/index'));


app.listen(3000);
console.log('Server running at http://127.0.0.1:3000/')