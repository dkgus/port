const { sequelize, Sequelize : { QueryTypes } } = require('./index');
const logger = require('../lib/logger');
/**
* 게시판 Model
*
*/
const board = {
	/**
	* 게시판 생성 
	*
	* @param String id 게시판 아이디
	* @param String boardNm 게시판이름
	*
	* @return Boolean 생성 성공 true
	*/
	create : async function(id, boardNm) {
		try {
			if (!id || !boardNm) {
				throw new Error('게시판 아이디 또는 게시판명 누락');
			}
			
			const sql = "INSERT INTO fly_board (id, boardNm) VALUES (:id, :boardNm)";
			const replacements = {
					id,
					boardNm,
			};
			await sequelize.query(sql, {
				replacements,
				type : QueryTypes.INSERT,
			});
			
			return true;
		} catch (err) {
			logger(err.stack, 'error');
			return false;
		}
	}
};

module.exports = board;