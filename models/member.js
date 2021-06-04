const  bcrypt = require('bcrypt');
const { sequelize, Sequelize : { QueryTypes } } = require('./index');
/**
* 회원 관련 model
*
*/
const member = {
	/**
	* 회원 가입 처리 
	* 
	*  비밀번호 해시는 bcrypt 방식으로 생성
	*  
	* @param Object params : 가입데이터
	* @return Integer|Boolean 성공시 회원번호, 실패시 false /Integer는 여기서 회원번호를 말함
	*/
	join : async function(params) { // params는 들어오는 데이터를 말함
		try {
			const sql = `INSERT INTO fly_member (memId, memPw, memNm, mobile, profile) 
									VALUES (:memId, :memPw, :memNm, :mobile, :profile)`;
									
			const hash = await bcrypt.hash(params.memPw, 10);
			
			const replacements = {

				
				memId : params.memId,
				memPw : hash,
				memNm : params.memNm,
				mobile : params.mobile,
				profile : params.filename || "",
			};
			const result = await sequelize.query(sql, {
				replacements,
				type : QueryTypes.INSERT,
			});
			
			// result[0] -> primary auto_increment  - memNo
			
			return result[0]; // memNo 
		} catch (err) {
			console.error(err);
			return false;
		}
	}
};

module.exports = member;
