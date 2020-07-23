var mongodb = require('mongodb')
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/admin';
 
var URL = require('url');
var express = require('express');
var router = express.Router();
 
var selectData = function(client, params, callback) {
 
    //连接到表
    var db = client.db('admin');
    var collectionTest = db.collection('user');
 
    //查询数据
    var whereStr;
    if (params.name) whereStr = {"name" : params.name, "pwd": params.pwd};
    collectionTest.find(whereStr, function(error, results){
        if (error) throw error;
        results.toArray(function(err, arr){
            if (error) throw callback(error);
            var response = {}
            if (arr.length === 1) {
                response = {
                    status: 0,
                    message: '登陆成功'
                }
            } else {
                response = {
                    status: 10000,
                    message: '用户名或密码错误'
                }
            }
            callback(response)
        });
    });
}
 
router.post('/', function(req, res, next){
 
    var params = req.body;
    if (!params.name) {
        res.send({'status': '1000', 'message': '名称不能为空'})
        return
    }

    if (!params.pwd) {
        res.send({'status': '1000', 'message': '密码不能为空'})
        return
    }
 
    MongoClient.connect(DB_CONN_STR, function(err, client) {
        console.log("连接成功！");
        selectData(client, params, function(result) {
            res.send(result);
            client.close();
            console.log("连接断开！");
        });
    });
})
 
module.exports = router;