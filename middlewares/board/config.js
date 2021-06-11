const { alert } = require('../../lib/message');
const board = require('../../models/board');

/**
* 게시판 설정 조회 및 게시판 아이디 필수 여부 체크 
*
*/
module.exports.boardConfig = async (req, res, next) => {
	const id = req.params.id || req.query.id || req.body.id;
	try {
		if (!id) {
			throw new Error('게시판 아이디 누락');
		}
		
		const boardConfig = await board.getBoard(id);
		if (!boardConfig) {
			throw new Error('존재하지 않는 게시판 입니다.');
		}
		
		req.boardConfig = boardConfig;
		
	} catch (err) {
		return alert(err.message, res, -1);
	}
	
	next();
};