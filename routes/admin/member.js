/**
* 회원관리 /admin/member
*
*/
const { adminOnly } = require('../../middlewares/member/member_check');
const express = require('express');
const router = express.Router();

/** 관리자 접근 권한 체크 */
router.use(adminOnly);

/** 공통 라우터 */
router.use((req, res, next) => {
	res.locals.menu = "member"; // 메뉴 구분 값 
	res.locals.menuTitle = '회원관리';
	next();
});

router.get("/", (req, res, next) => {
	return res.render("admin/member/index");
});

module.exports = router;