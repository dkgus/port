const { alert } = require('../../lib/message');

/** 
* 회원전용, 비회원 전용, 관리자 전용 체크 
*
*/

module.exports.adminOnly = (req, res, next) => {
	
	/* 관리자가 아니면 접속 불가 */
    if (!req.isLogin || !req.member.isAdmin) {
        //return res.redirect("/");
         //res.status(401); 
        //return alert('페이지 접속 권한이 없습니다.', res, -1);
    }
    next();
};


/**
* 비회원 전용 페이지 미들웨어 
*
*/
module.exports.guestOnly = (req, res, next) => {
    if (req.isLogin) {
        res.status(401);
        return alert('로그인한 회원은 접속할 수 없습니다.', res, -1);
    }
    
    next();
};



/**
* 회원전용 페이지 미들웨어
*
*/
module.exports.memberOnly = (req, res, next) => {
		if (!req.isLogin) {
			res.status(401);
			return alert('회원전용 페이지 입니다.', res, -1);
		}
			
		next();
};