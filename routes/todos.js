'use strict';
var router = require('express').Router();
var AV = require('leanengine');

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({  
  service: 'qq',  
  auth: {  
    user: '396249450@qq.com',  
    pass: 'isdffzkwhwqjbicg' //授权码,通过QQ获取  
  
  }  
});  
var mailOptions = {  
	from: '396249450@qq.com', // 发送者  
	to: '876627681@qq.com', // 接受者,可以同时发送多个,以逗号隔开  
	subject: '程序错误报告', // 标题  
	//text: 'Hello world', // 文本  
	html: `来人呐,程序出错了!`   
};
  
var Todo = AV.Object.extend('Todo');
var Maclist = AV.Object.extend('Maclist');

// 查询 Todo 列表
router.get('/', function(req, res, next) {
  /*var query = new AV.Query(Todo);
  query.descending('createdAt');
  query.find().then(function(results) {
    res.render('todos', {
      title: 'TODO 列表',
      todos: results
    });
  }, function(err) {
    if (err.code === 101) {
      // 该错误的信息为：{ code: 101, message: 'Class or object doesn\'t exists.' }，说明 Todo 数据表还未创建，所以返回空的 Todo 列表。
      // 具体的错误代码详见：https://leancloud.cn/docs/error_code.html
      res.render('todos', {
        title: 'TODO 列表',
        todos: []
      });
    } else {
      next(err);
    }
  }).catch(next);*/
  res.render('todos', {title: 'TODO 列表',todos: []});
});

// 新增 Todo 项目
router.post('/', function(req, res, next) {
  var content = req.body.content;
  var username = req.body.username;
  var userscore = req.body.userscore;
  var lotteryscore = req.body.lotteryscore;
  var phonescore = req.body.phonescore;
  var jdscore = req.body.jdscore;
  var money = req.body.money;
  var todo = new Todo();
  todo.set('username', username == ''?'0':username);
  todo.set('userscore', userscore == ''?'{}':JSON.parse(userscore));
  todo.set('lotteryscore', lotteryscore == ''?'0':lotteryscore);
  todo.set('phonescore', phonescore == ''?'0':phonescore);
  todo.set('jdscore', jdscore == ''?'0':jdscore);
  todo.set('money', money == ''?'0':money);
  todo.set('content', content == ''?'0':content);
  todo.save().then(function(todo) {
    res.redirect('/todos');
  }).catch(next);
});
// 修改Todo 项目
router.post('/update', function(req, res, next) {
  var objectid = req.body.objectid;
  var content = req.body.content;
  var username = req.body.username;
  var userscore = req.body.userscore;
  var lotteryscore = req.body.lotteryscore;
  var phonescore = req.body.phonescore;
  var jdscore = req.body.jdscore;
  var money = req.body.money;
  var phonegetlist = req.body.phonegetlist;
  var macid = req.body.macid;
  
  var todo = AV.Object.createWithoutData('Todo', objectid);
  todo.set('username', username == ''?'0':username);
  todo.set('userscore', userscore == ''?'{}':JSON.parse(userscore));
  todo.set('lotteryscore', lotteryscore == ''?'0':lotteryscore);
  todo.set('phonescore', phonescore == ''?'0':phonescore);
  todo.set('jdscore', jdscore == ''?'0':jdscore);
  todo.set('money', money == ''?'0':money);
  todo.set('content', content == ''?'0':content);
  todo.set('phonegetlist', phonegetlist == ''?'0':phonegetlist);
  todo.set('macid', macid == ''?0:parseInt(macid));
  todo.save().then(function(todo) {
    res.redirect('/todos');
  }).catch(next);
});
router.get('/sendemail', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Content-Type", "application/json;charset=utf-8");
	transporter.sendMail(mailOptions, function (err, info) {
		if (err) {  
		  console.log(err); 
		} 
		res.json({
			back:"成功"
		});
	});
});
router.post('/sendID', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Content-Type", "application/json;charset=utf-8");
	console.log(req.body.objectId);
	var objectid = req.body.objectId;
  var todo = new AV.Query('Todo');
	todo.equalTo('username', objectid);
  todo.first().then(function (data) {
  	console.log(data);
	  data.set('content', ''+(new Date()).getTime());
	  data.save().then(function(todo) {
	    res.json({
				back:"成功"
			});
	  }).catch(next);
  }, function (error) {
  	
  });
});
router.get('/getlist', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	  res.header("Content-Type", "application/json;charset=utf-8");
	  var query = new AV.Query(Todo);
	  //query.ascending('macid');
	  //query.addAscending('macid');
	  query.find().then(function(results) {
	    res.json({
			  back:results
			});
	  }, function(err) {
	    res.json({
			  back:"error"
			});
	  }).catch(next);
	  
});
router.get('/getmaclist', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	  res.header("Content-Type", "application/json;charset=utf-8");
	  var query = new AV.Query(Maclist);
	  //query.ascending('createdAt');
	  //query.addAscending('macid');
	  query.find().then(function(results) {
	    res.json({
			  back:results
			});
	  }, function(err) {
	    res.json({
			  back:"error"
			});
	  }).catch(next);
	  
});
router.post('/remove', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	  res.header("Content-Type", "application/json;charset=utf-8");
	  console.log(req.body.objectId);
	  var todo = AV.Object.createWithoutData('Todo', req.body.objectId);
	  todo.destroy().then(function (success) {
	    // 删除成功
	  	res.json({
			  back:"success"
			});
	  }, function (error) {
	  	res.json({
			  back:"error"
			});
	    // 删除失败
	  });
});

// 新增 Todo 项目
router.post('/maclist', function(req, res, next) {
  
  var macstr = req.body.macstr;
  var imeistr = req.body.imeistr;
  var imsistr = req.body.imsistr;
  var phonenum = req.body.phonenum;
  var maclist = new Maclist();
  maclist.set('macstr', macstr == ''?'0':macstr);
  maclist.set('imeistr', imeistr == ''?'0':imeistr);
  maclist.set('imsistr', imsistr == ''?'0':imsistr);
  maclist.set('phonenum', phonenum == ''?'0':phonenum);
  maclist.save().then(function(todo) {
    res.redirect('/');
  }).catch(next);
});
module.exports = router;
