const message = require('../../lib/message');
const { sequelize, Sequelize : { QueryTypes } } = require("../../models");
const fs = require('fs').promises;

/**
* [미들웨어]회원 가입 양식 유효성 검사 
*
* 유효성 검사 실패 
*  원래 페이지로 되돌아가기
*  성공시, next() 호출 해서 다음 미들웨어로 진행
*/
module.exports.joinFormValidator = async function (req, res, next) {
	try {
		/** 필수 입력항목 체크 S */
		const required = {
			memId : "아이디를 입력하세요.",
			memPw : "비밀번호를 입력하세요.",
			memPwRe : "비밀번호를 확인해 주세요.",
			memNm : "이름을 입력해 주세요.",
		};
		
		for (key in required) {
			if (!req.body[key]) {
				throw new Error(required[key]);
			}
		}
		/** 필수 입력항목 체크 E */
		
		/** 
			아이디 체크 
				- 자리수 8~15
				- 소문자 알파벳, 숫자
		*/
		const memId = req.body.memId;
		if (memId.length < 8 || memId.length > 15 || /[^a-z0-9]/.test(memId)) {
			throw new Error("아이디는 8~15자로 구성된 소문자 알파벳, 숫자로 입력하세요.");
		}
		
		/** 이미 등록된 아이디 여부 체크 */
		const sql = "SELECT COUNT(*) as cnt FROM fly_member WHERE memId = ?";
		const rows = await sequelize.query(sql, {
			replacements : [memId],
			type : QueryTypes.SELECT,
		});
		if (rows[0].cnt > 0) { // 이미 등록된 아이디 있는 경우 
			throw new Error(`이미 가입된 아이디 입니다 - ${memId}`);
		}
		
		/** 
			비밀번호 체크 S 
				- 자리수 8~20
				- 최소 1자 이상 알파벳과 숫자 포함, 최소 1자는 대문자 알파벳
				- 최소 1자이상 특수문자 포함(~!@#$%^&*())
		*/
		const memPw = req.body.memPw;
		if (memPw.length < 8 || memPw.length > 20 || !/[a-z]/.test(memPw) || !/[A-Z]/.test(memPw) || !/[\d]/.test(memPw) || !/[~!@#$%\^&\*\(\)]/.test(memPw)) {
			throw new Error("비밀번호는 8~20자로 구성된 소문자와 대문자 포함 알파벳과 숫자, 특수문자로 입력하세요.");
		}
		
		if (req.body.memPw != req.body.memPwRe) {
			throw new Error("입력하신 비밀번호가 정확하지 않습니다.");
		}
		
		/** 비밀번호 체크 E */
		
		/** 휴대전화번호 체크 S */
		if (req.body.mobile) {
			let mobile = req.body.mobile.replace(/\D/g, "");
			if (mobile.length != 11) {
				throw new Error("휴대전화번호 양식이 아닙니다.");
			}
			// (패턴) (패턴) .. (패턴) --> 서브 패턴 -> 교체, 패턴별 데이터 추출 
			// 010 3481 2101   010__3481__2101  010*3481*2101
			// 010-3481-2101
			req.body.mobile = mobile.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
		}
		/** 휴대전화번호 체크 E */
		
		/** 
			업로드 파일 체크
			
		*/
		if (req.file) {
			// 이미지가 아닌 파일이 업로드 되었을때 
			if (req.file.mimetype.indexOf("image") == -1) {
				// 파일 삭제
				await fs.unlink(req.file.path)
				
				// 다시 업로드 요청
				throw new Error("이미지 형식의 파일만 업로드 가능합니다.");
			}
		}
		
	} catch (err) {
		message.alertBack(err.message, res);
		return;
	}
	
	next(); // 유효성 검사 성공시 다음 미들웨어로 이동 
};	
