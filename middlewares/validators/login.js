const message = require("../../lib/message");

/**
* [미들웨어] 로그인 입력 검증 
*
*/
module.exports.loginFormValidator = function (req, res, next) {
	if (!req.body.memId) {
		return message.alertBack("아이디를 입력하세요.", res);
	}
	
	if (!req.body.memPw) {
		return message.alertBack("비밀번호를 입력하세요.", res);
	}
	
	// 로그인 양식 검증 성공시 다음 미들웨어로 이동 
	next();
};