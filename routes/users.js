var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//注册
router.get('/register',function(req, res, next){
  res.render('user/register');
  // res.send('respond with a resoasasdsadurce');
});
//注册的最好选用post方法，此处先用get做演示用
router.post('/register',function(req,res,next){
  //获取请求到的用户名和密码
    console.log(req.body.username);
    console.log(req.body.pwd);
    res.send("注册成功");
});

module.exports = router;
