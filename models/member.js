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
			const sql = `INSERT INTO fly_member (memId, memPw, memNm, mobile) 
									VALUES (:memId, :memPw, :memNm, :mobile)`;
									
			const hash = await bcrypt.hash(params.memPw, 10);
			
			const replacements = {

				
				memId : params.memId,
				memPw : hash,
				memNm : params.memNm,
				mobile : params.mobile
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
	},

    	/**
	* 로그인 처리 
	*
	* @param String memId 회원아이디 
	* @param String memPw 회원비밀번호
	* @param Request req 객체
	*						req.session.속성명
	*
	* @return Boolean 
	*/
	login : async function (memId, memPw, req) {
		try {
			const sql = "SELECT * FROM fly_member WHERE memId = ?";
			const rows = await sequelize.query(sql, {
				replacements : [memId],// memId = ?에 치환될 수 있는것이 replacements
				type : QueryTypes.SELECT,
			});
			if (rows && rows[0]) {
				const match = await bcrypt.compare(memPw, rows[0].memPw);//bcrypt.compare는 로그인시 사용자가 입력한 비밀번호의 해시값이 데베에 저장된 해시값과 같은지 비교하는 메소드
				//리턴은 불리언으로 비교해보고 해시값이 같으면 t 다르면 f리턴
				if (match) {
					// 로그인 세션 처리 	
					delete rows[0].memPw;
					req.session.member = rows[0];
					req.session.memNo = rows[0].memNo;
					
					return true;
				} else {
					return false;
				}
			}
		} catch (err) {
			console.error(err);
			return false;
		}
	},

    	/**
	* 회원 정보 추출 
	*
	* @param Integer memNo 회원번호 
	* @return Object|Boolean 
	*/
	getInfo : async function (memNo) {
		try {
			const sql = "SELECT * FROM fly_member WHERE memNo = ?";
			//넘버가 1번이올 수 있고 2번도 올수있고 바뀔수있음
			//지금은 ?이지만 값이 넘어오면 해당번호인 것을 SELECT하겠다는 
			//의미로 ?를 사용함
			const rows = await sequelize.query(sql, {
				replacements : [memNo],
				type : QueryType.SELECT,
			});
			if (rows.length > 0) {
				delete rows[0].memPw; //비밀번호는 지워줘야한다.
				return rows[0];
			} else {
				return false;
			}
			
		} catch (err) {
			console.log(err);
			return false;
		}
	},
};

module.exports = member;
