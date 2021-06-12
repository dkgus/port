const { boardConfig } = require('../middlewares/board/config');
const express = require('express');
const router = express.Router();

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
	.post(boardConfig, (req, res, next) => {
		console.log(req.body);
		return res.send("");
	})
	/** 게시글 수정 처리 */
	.patch((req, res, next) => {
		
	})
	/** 게시글 작성 처리 */
	.delete((req, res, next) => {
		
	});

module.exports = router;