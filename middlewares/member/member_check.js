/** 
* 회원전용, 비회원 전용, 관리자 전용 체크 
*
*/

module.exports.adminOnly = (req, res, next) => {
	
	/* 관리자가 아니면 접속 불가 */
    if (!req.isLogin || !req.member.isAdmin) {
        //return res.redirect("/");
    }
    next();
};