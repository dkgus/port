const { boardConfig } = require('../middlewares/board/config');
const { postValidator, memberOnlyCheck, permissionCheck } = require("../middlewares/board/post_validator");
const { alert, go, reload } = require('../lib/message');
const express = require('express');
const router = express.Router();
const board = require('../models/board');
const bcrypt = require('bcrypt');

/** 댓글  */
router.route("/comment")
	/** 댓글 등록 */
	.post(async (req, res, next) => {
		const idx = await board.data(req.body, req.session).writeComment();
		
		if (idx) { // 등록 성공시 
			
			const url = "/board/view/" + req.body.idxBoard + "?comment_done=" + idx;
			return go(url, res, "parent");
		}
		
		return alert("댓글 등록 실패하였습니다.", res);
		// 등록 실패 
	})
	/** 댓글 수정 */
	.patch(async (req, res, next) => {
		const result = await board.data(req.body).updateComment();
		if (result) { // 댓글 수정 완료 시 새로고침 
			
			// 비회원 댓글 비밀번호 확인 session 삭제 
			delete req.session['comment_' + req.body.idx];
			
			const data = await board.getComment(req.body.idx);
			const url = "/board/view/" + data.idxBoard;
			return go(url, res, "parent");
		}
		
		return alert("댓글 수정에 실패하였습니다.", res);
	});

/** 댓글 수정 양식 */
router.get("/comment/:idx", permissionCheck('comment'), async (req, res, next) => {
	try {
		const idx = req.params.idx;
		const data = await board.getComment(idx);
		if (!data) {
			throw new Error('등록되지 않은 댓글 입니다.');
		}
		
		
		return res.render("board/comment_form", data);
	} catch (err) {
		return alert(err.message, res);
	}
});

/** 댓글 삭제 */
router.get("/comment/delete/:idx", permissionCheck('comment', 'delete'), async (req, res, next) => {
	try {
		const idx = req.params.idx;
		const data = await board.getComment(idx);
		if (!data) {
			throw new Error("등록되지 않은 댓글 입니다.");
		}
		
		const result = await board.deleteComment(idx);
		if (result) { // 삭제 성공 
			// 비회원 댓글 비밀번호 확인 session 삭제 
			delete req.session['comment_' + idx];
		
			return go("/board/view/" + data.idxBoard, res);
		}
		

		throw new Error('댓글 삭제 실패하였습니다.');
		
		// 삭제 실패 
	} catch (err) {
		return alert(err.message, res, -1);
	}
});

/** 
	게시글 쓰기, 수정, 삭제 
	/board/:id 
	  - 게시판아이디이면 게시글 쓰기 양식(GET), 처리(POST)
	  - 게시글 번호라면 수정처리(PATCH), 삭제 처리(DELETE)
*/

router.route('/:id')
	/** 게시글 작성 양식 */
	.get(boardConfig, memberOnlyCheck, (req, res, next) => {
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
	/** 수정 - id (게시글 번호) */
	.patch(boardConfig, postValidator, async (req, res, next) => {
		const result = await board.data(req.body, req.session)
											.update();
		if (result) { // 수정 완료 시 게시글 보기 페이지로 이동 
			
			// 비회원 게시글 비밀번호 확인 session 삭제 
			delete req.session['board_' + req.body.idx];
		
			return go("/board/view/" + req.body.idx, res, 'parent');
		} 
		
		return alert('게시글 수정에 실패하였습니다.', res);
	});

/** 게시글 보기*/
router.get("/view/:idx", async (req, res, next) => {
	try {
		const idx = req.params.idx;
		const data = await board.get(idx);
		if (!data.idx) {
			throw new Error('존재하지 않는 게시글 입니다.');
		}
		
		/** 댓글 조회 */
		data.comments = await board.getComments(idx);
		
		data.addCss = ["board"];
		data.addScript = ['board'];
		
		/** 게시글 조회수 업데이트 */
		await board.updateViewCount(idx, req);
	
		return res.render("board/view", data);
	} catch (err) {
		return alert(err.message, res, -1);
	}
});

/** 게시글 목록 */
router.get("/list/:id", boardConfig, async (req, res, next) => {

	const boardId = req.params.id;
	const category = req.query.category;
	
	/** 검색 처리 S */
	const where = {
		binds : [],
		params : {},
	};
	
	if (category) {
		where.binds.push("a.category = :category");
		where.params.category = category;
	}
	/** 검색 처리 E */
	
	const data = await board
								.addWhere(where)
								.getList(boardId, req.query.page, 20, req.query);
	data.config = req.boardConfig;
	data.addCss = ['board'];
	data.category = category;
	
	return res.render("board/list", data);
});

/** 게시글 수정 */
router.get("/update/:idx", permissionCheck(), async (req, res, next) => {
	try {
		const idx = req.params.idx;
		const data = await board.get(idx);
		if (!data.idx) {
			throw new Error('존재하지 않는 게시글 입니다.');
		}
		
		data.addCss = ["board"];
		data.addScript = ["board"];
		
		return res.render("board/form", data);
	} catch (err) {
		return alert(err.message, res, -1);
	}
});

/** 게시글 삭제 */
router.get("/delete/:idx", permissionCheck('', 'delete'), async (req, res, next) => {
	try {
		const idx = req.params.idx;
		const data = await board.get(idx);
		if (!data.idx) {
			throw new Error('게시글이 존재하지 않습니다.');
		}
		
		const result = await board.delete(idx);
		if (!result) { // 게시글 삭제 실패
			throw new Error('게시글 삭제에 실해하였습니다.');
		} 
		// 비회원 게시글 비밀번호 확인 session 삭제 
		delete req.session['board_' + idx];
		
		// 게시글 삭제 완료 -> 게시글 목록으로 이동 
		return go("/board/list/" + data.boardId, res);
		
	} catch (err) {
		return alert(err.message, res, -1);
	}
	
});

/** 게시글 수정, 댓글 비회원 비밀번호 체크 */
router.route("/password/:idx")
	.get(async (req, res, next) => {
		try {
			const idx = req.params.idx;
			const mode = req.query.mode;
			const type = req.query.type;
			const messageType = (mode == "comment")?"댓글":"게시글";
			
			let data = "";
			if (mode == 'comment') {
				data = await board.getComment(idx);
			} else {
				data = await board.get(idx);
			}
			
			if (!data.idx) {
				throw new Error(`등록되지 않은 ${messageType}입니다.`);
			}
			
			// 회원 게시글, 댓글은 비밀번호 확인 필요 없음
			if (data.memNo) {
				throw new Error(`비회원 ${messageType}만 비밀번호 확인이 필요합니다.`);
			}
			
			data.mode = mode;
			data.type = type;
			data.idx = idx;
			
			data.addCss = ['board'];
			return res.render("board/password", data);
		} catch (err) {
			return alert(err.message, res, -1);
		}
	})
	.post(async (req, res, next) => {
		try {
			let key = "", url = "";
			let data = {};
			const idx = req.body.idx;
			const typeStr = (req.mode == 'comment')?"댓글":"게시글";
			const type = req.body.type;
			
			if (!idx) {
				throw new Error('잘못된 접근입니다.');
			}
			
			if (!req.body.password) {
				throw new Error('비밀번호를 입력하세요');
			}
			
			if (req.body.mode == 'comment') {
				key = "comment_" + idx;
				keyUrl = key + "_url";
				data = await board.getComment(idx);
				url = "/board/view/" + data.idxBoard;
				if (type != 'delete') { // 
					url += "?idx_comment=" + idx;
				}
			} else {
				key = "board_" + idx;
				keyUrl = key + "_url";
				data = await board.get(idx);
				if (type == 'delete') {
					url = "/board/delete/" + idx;
				} else {
					url = "/board/update/" + idx;
				}
			}
			
				
			if (!data.idx) {
				throw new Error(`등록되지 않은 ${typeStr}입니다.`);
			}
			
			const match = await bcrypt.compare(req.body.password, data.password);
			if (match) { // 비밀번호 일치, 확인 결과 session에 등록 --> URL 이동 
				// 단 댓글 삭제인 경우는 바로 삭제
				if (req.body.mode == 'comment' && type == 'delete') {
					await board.deleteComment(idx);
				} else {
					req.session[key] = true;
				}
				return go(url, res, "parent");
			} 
		
			// 비밀번호 불일치 
			throw new Error('비밀번호가 일치하지 않습니다');
		
		} catch (err) {
			return alert(err.message, res);
		}
	});

module.exports = router;