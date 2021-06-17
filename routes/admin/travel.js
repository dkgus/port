/**
* 여행 상품관리 /admin/travel
*
*/
const { adminOnly } = require('../../middlewares/member/member_check');
const { alert, reload } = require('../../lib/common');
const travel = require('../../models/travel');
const express = require('express');
const router = express.Router();

/** 관리자 접근 권한 체크 */
router.use(adminOnly);

/** 공통 라우터 */
router.use((req, res, next) => {
	res.locals.menu = "travel"; // 메뉴 구분 값
	res.locals.menuTitle = '여행 상품관리';
	next();
});


router.route("/")
		/** 여행상품 등록, 목록 */
		.get((req, res, next) => {
			
			return res.render("admin/travel/index");
		})
		/** 여행 상품 등록 처리 */
		.post(async (req, res, next) => {
			const result = await travel.create(req.body.goodsCd, req.body.goodsNm);
			
			return res.send("");
		});





router.route("/:goodsCd")
		/** 상품수정양식 */
		.get((req,res,next)=>{

			return res.render("admin/travel/form")
		})
		/** 상품 수정처리 */


module.exports = router;