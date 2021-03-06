const { adminOnly } = require('../middlewares/member/member_check');
const express = require('express');
const router = express.Router();

/** 관리자 접근 권한 체크 */
router.use(adminOnly);

/** 공통 라우터 */
router.use((req, res, next) => {
	res.locals.menu = "main"; // 메뉴 구분 값 
	res.locals.menuTitle = '관리자 메인';
	next();
});

router.get("/", (req, res, next) => {
    return res.render("admin/main/index");
});




module.exports = router;