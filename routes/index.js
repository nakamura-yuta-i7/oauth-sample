var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
		title: 'Express',
		session: req.session.passport, //passportでログイン後は、このオブジェクトに情報が格納されます。
	});
});

module.exports = router;
