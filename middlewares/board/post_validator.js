const { alert, go } = require('../../lib/message');
const board = require('../../models/board');

/**
* 게시글 작성, 수정 유효성 검사 
*
*/
module.exports.postValidator = (req, res, next) => {
		try {
			const required = {
				'id' : '잘못된 접근입니다.',
				'subject' : '제목을 입력하세요',
				'poster' : '작성자를 입력하세요',
				'contents' : '내용을 입력하세요',
			};
			// 비회원인 경우 
			if (!req.isLogin) {
				required.password = "글 수정, 삭제 비밀번호를 입력하세요";
			}
			
			// 게시글 수정인 경우 
			if (req.method == 'PATCH') {
				required.idx = "잘못된 접근입니다.";
			}
			
			for (column in required) {
				if (!req.body[column]) {
					throw new Error(required[column]);
				}
			}
		} catch (err) {
			return alert(err.message, res);
		}
	
		next();
};


module.exports.memberOnlyCheck = (req, res, next) => {
		try {
			if (req.boardConfig.accessType == 'member' && !req.isLogin) {
				throw new Error('회원전용 게시판입니다.');
			}
			
		} catch(err) {
			return alert(err.message, res, -1);
		}
		next();
};

/** 
* 게시글, 댓글 수정, 삭제 권한 체크 
*
* 회원인 경우는 회원번호 일치 여부 체크, 비회원인 경우는 
* 게시글, 댓글 비밀번호 확인 완료 한 경우가 아니라면 비밀번호 체크로 이동 
*/
module.exports.permissionCheck = (mode, type) => {
	mode = mode || "";
	type = type || "";
	return async (req, res, next) => {
		try {
			/** 관리자인 경우는 수정,삭제 제한 없음 */
			if (req.isLogin && req.member.isAdmin) {
				return next();
			}
			
			const idx = req.params.idx || req.query.idx || req.body.idx;
			
			let data = key = "";
			if (mode == 'comment') { // 댓글 
				data = await board.getComment(idx);
				key = "comment_" + idx;
			} else { // 게시글
				data = await board.get(idx);
				key = "board_" + idx;
			}
			
			/** 회원 게시글, 댓글인 경우 */
			if (data.memNo && (!req.isLogin || data.memNo != req.session.memNo)) {
				let msg = (type == 'delete')?"삭제":"수정";
				msg += " 권한이 없습니다.";
				throw new Error(msg);
			}
	
			/** 비회원 게시글이고 비회원 비밀번호 체크가 완료 되지 않은 경우 -> 비밀번호 확인 페이지 이동 */
			if (!data.memNo && !req.session[key]) {
				let url = '/board/password/' + idx + "?mode=" + mode + "&type=" + type;				
				return go(url, res);
			}
			
		} catch (err) {
			return alert(err.message, res, -1);
		}
	
		next();
	};
};