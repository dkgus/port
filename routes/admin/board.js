/**
* 게시판 관리 /admin/board
*
*/
const { adminOnly } = require('../../middlewares/member/member_check');
const { alert, reload } = require('../../lib/message');
const board = require('../../models/board');
const express = require('express');
const router = express.Router();

/** 관리자 접근 권한 체크 */
router.use(adminOnly);

/** 공통 라우터 */
router.use((req, res, next) => {
	res.locals.menu = "board"; // 메뉴 구분 값 
	res.locals.menuTitle = '게시판 관리';
	next();
});

router.get("/", async (req, res, next) => {
	const list = await board.getBoards(); // 게시판 목록 
	console.log(list);
	return res.render("admin/board/index", { list });
});


/** 게시글 설정  */
router.route('/config')
		/** 게시글 설정 등록 */
		.post(async (req, res, next) => {
			/** 게시판 등록 */
			const result = await board.create(req.body.id, req.body.boardNm);
			if (!result) {
				return alert('게시판 등록 실패하였습니다.', res);
			}
			
			return reload(res, 'parent');
		})
		/** 게시글 설정 수정 */
		.patch((req, res, next) => {
			
		})
		/** 게시글 설정 삭제 */
		.delete((req, res, next) => {
			
		});

module.exports = router;