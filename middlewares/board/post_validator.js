const { alert } = require('../../lib/message');

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


module.exports.permissionCheck = (req, res, next) => {
		try {
			if (req.boardConfig.accessType == 'member' && !req.isLogin) {
				throw new Error('회원전용 게시판입니다.');
			}
			
		} catch(err) {
			return alert(err.message, res, -1);
		}
		next();
};