const express = require('express');
const { alert } = require('../lib/message');
const router = express.Router();
const travel = require('../models/travel');
const member = require('../models/member');
const { memberOnly } = require("../middlewares/member/member_check");
const { joinFormValidator } = require("../middlewares/validators/join");
const path = require('path');

/**
* 마이페이지 
*
*/

// 회원전용 페이지 체크 */
router.use(memberOnly);

/** 공통 라우터 */
router.use((req, res, next) => {
	res.locals.asidePath = path.join(__dirname, "../views/outline/side/_mypage.html"); // 마이페이지 사이드 메뉴
	next();
});

router.get("/", (req, res, next) => {
	
	return res.render("mypage/index");
});

/** 회원 정보 수정 */
router.route("/myinfo")
	/** 양식 */
	.get((req, res, next) => {
		const data = {
			addCss : ['member'],
		};
		return res.render("member/form", data);
	})
	/** 처리 */
	.post(joinFormValidator, async (req, res, next) => {
		req.body.memNo = req.session.memNo;
		const result = await member.update(req.body);
		if (result) { // 회원정보 수정 완료시 
			return alert("회원정보가 수정되었습니다.", res, 'reload', 'parent');
		}
	
		// 회원정보 수정 실패시 
		return alert("회원정보 수정에 실패하였습니다.", res);
	});

router.get("/reservation", async (req, res, next) => {
	const data = await travel.getReservations(req.query.page, 20, req.query, req.session.memNo);
	return res.render("mypage/reservation", data);
});

module.exports = router;