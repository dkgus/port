const member = require('../../models/member');
/**
* [미들웨어] 로그인 세션 처리 
*
* 전역에 회원 정보 유지
* req.session.memNo -> 로그인 한 경우 
*/
module.exports.loginSession = async (req, res, next) => {
		/** 로그인이 된 경우 세션 처리 */
		req.isLogin = res.isLogin = res.locals.isLogin = false;
		if (req.session.memId) { 
		//로그인이 되었을 때
			const info = await member.get(req.session.memId);
			delete info.memPw;
			if (info) {
				req.isLogin = res.isLogin = res.locals.isLogin = true;
				//로그인 된 후
				req.session.member = req.member = res.member = res.locals.member = info;
				req.session.memNo = info.memNo;
				//회원정보가 전역에 있을 때 로컬스에 유지(넌적스에만 해당)  이즈 로그인있을 때 
				//오른쪽->왼쪽 대입 
			}
		} // endif 
		
		next();
};