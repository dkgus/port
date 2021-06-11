/**
* 게시판 관리 /admin/board
*
*/
const { adminOnly } = require('../../middlewares/member/member_check');
const { alert, reload } = require('../../lib/message');
const { boardConfig } = require("../../middlewares/board/config"); // 게시판 설정 조회 및 체크 미들웨어 
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

/** 게시판 등록, 목록 조회 */
router.route("/")
	.get(async (req, res, next) => {
		const list = await board.getBoards(); // 게시판 목록 
		return res.render("admin/board/index", { list });
	})
	/** 게시글 설정 등록 */
	.post(async (req, res, next) => {
		/** 게시판 등록 */
		const result = await board.create(req.body.id, req.body.boardNm);
		if (!result) {
			return alert('게시판 등록 실패하였습니다.', res);
		}
			
		return reload(res, 'parent');
	})
	/**  게시판 삭제 */
	.delete(async (req, res, next) => {
		
	});
	
/** 
* 게시판 수정 
* 게시판 설정은 관리자에서 수정과 프론트에서 게시글 작성, 수정, 삭제등 
* 많은 라우터에서 필요할 수 있으므로 미들웨어로 만들어 관리
*/
router.route("/:id")
		/** 게시판 수정 양식 */
		.get(boardConfig, (req, res, next) => {
			const data = req.boardConfig;
			data.menuTitle = `게시판 설정(${req.boardConfig.boardNm} - ${req.boardConfig.id})`;
			                                            //게시판 아이디-게시판 이름이 순서대로 화면에 출력

			return res.render("admin/board/form", data);
		})
		/** 게시판 수정 처리 */
		.post(boardConfig, async (req, res, next) => {
			const result = await board.data(req.body).save();
			if (!result) {
				return alert('게시판 저장에 실패하였습니다.', res, -1);
			}
			
			return alert('저장되었습니다', res, 'reload', 'parent');
		});

module.exports = router;