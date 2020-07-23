var mongodb = require('mongodb')
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/admin';
 
var URL = require('url');
var express = require('express');
var router = express.Router();

function insertData(client, params, callback)
{
    var db = client.db("admin");
    var connectionTest = db.collection("user");
    var testData = {"name":params.name,"pwd":params.pwd};
    //查询数据
    var whereStr;
    if (params.name) whereStr = {"name" : params.name};
    connectionTest.find(whereStr,function(err, results){
        if (err) throw callback(err);
        results.toArray(function(err, arr){
            if (err) throw err;
            var response = {}
            if (arr.length>0) {
                response = {
                    status: 10000,
                    message: '用户名重复'
                }
                callback(response)
            } else {
                connectionTest.insert(testData,function(error, result){
                    if(error){
                        response = {
                            status: 10000,
                            message: '服务器出现问题'
                        }
                    }else{
                        response = {
                            status: 0,
                            message: '注册成功'
                        }
                    }
                    callback(response);
                });
            }
        })
    })
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
        console.log('连接成功')
        insertData(client, params, function(result) {
            res.send(result);
            client.close();
            console.log("连接断开！");
        });
    });
})
 
module.exports = router;