const { boardConfig } = require('../middlewares/board/config');
const { postValidator } = require("../middlewares/board/post_validator");
const { alert, go } = require('../lib/message');
const express = require('express');
const router = express.Router();
const board = require('../models/board');

/** 
	게시글 쓰기, 수정, 삭제 
	/board/:id 
	  - 게시판아이디이면 게시글 쓰기 양식(GET), 처리(POST)
	  - 게시글 번호라면 수정처리(PATCH), 삭제 처리(DELETE)
*/

router.route('/:id')
	/** 게시글 작성 양식 */
	.get(boardConfig, (req, res, next) => {
		const data = {
			config : req.boardConfig,
			poster : req.isLogin?req.member.memNm:"",
			addCss : ['board'],
			addScript : ['board'],
			pageTitle : req.boardConfig.boardNm,
		};
		
		return res.render("board/form", data);
	})
	/** 게시글 작성 처리 */
	.post(boardConfig, postValidator, async (req, res, next) => {
		const idx = await board.data(req.body, req.session).write();
		if (idx) { // 게시글 작성 후에는 게시글 보기 페이지로 이동 
			return go("/board/view/" + idx, res, "parent");
		}
		
		return alert("게시글 작성에 실패하였습니다.");
	})
	/** 게시글 수정 처리 */
	.patch((req, res, next) => {
		
	})
	/** 게시글 작성 처리 */
	.delete((req, res, next) => {
		
	});

/** 게시글 보기*/
router.get("/view/:idx", async (req, res, next) => {
	
	return res.send("");
});

/** 게시글 목록 */
router.get("/list/:id", async (req, res, next) => {
	
	return res.send("");
});

module.exports = router;