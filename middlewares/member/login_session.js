/**
* [미들웨어] 로그인 세션 처리 
*
* 전역에 회원 정보 유지
* req.session.memNo -> 로그인 한 경우 
*/
module.exports = () => {
	return (req, res, next) => {
		if (req.session.memNo) { // 로그인 상태
			res.locals.isLogin = req.isLogin = true;
			req.member = res.locals.member = req.session.member;
			
		} else { // 미로그인 상태 
			res.locals.isLogin = req.isLogin = false;
		}
		
		// 다음 미들웨어로 이동하므로 반드시 next();
		next();
	};
};