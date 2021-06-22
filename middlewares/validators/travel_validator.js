const { alert } = require("../../lib/common");

/**
* 여행 관련 유효성 검사 
*/

/** 예약 접수 유효성 검사 */
module.exports.reservationApplyValidator = (req, res, next) => {
	console.log(req.body);
	try {
		/** 예약자 정보 체크 S */
		const required = {
			goodsCd : "잘못된 접근입니다.",
			period : "여행기간을 선택하세요",
			name : "예약자 이름을 입력하세요",
			birth : "예약자 생년월일을 입력하세요",
			email : "예약자 이메일을 입력하세요",
			cellPhone : "예약자 휴대폰번호를 입력하세요.",
		};
		
		for (key in required) {
			if (!req.body[key]) {
				throw new Error(required[key]);
			}
		}
		/** 예약자 정보 체크 E */
		
		/**  여행자 정보 체크  S */
		// 성인1명은 필수 여부 체크
		if (req.body.travelerNm_adult.length == 0) {
			throw new Error('예약 신청은 적어도 1명 이상의 성인을 포함하셔야 합니다.');
		}
		
		['adult', 'child', 'infant'].forEach((type) => {
			const required = {
				travelerNm : "여행자 성명(한글)을 입력하세요",
				travelerBirth : "여행자 생년월일을 입력하세요",
				travelerGender : "여행자 성별을 선택하세요",
			};
			
			if (type == 'adult') {
				required.travelerCellPhone = "여행자 휴대폰 번호를 입력하세요";
				required.travelerEmail = "여행자 이메일 주소를 입력하세요.";
			}
			
			const cnt = Number(req.body['goodsCnt_' + type]);
			if (cnt > 0) {
				for (key in required) {
					const _key = key + "_" + type;
					if (!(req.body[_key] instanceof Array)) {
						req.body[_key] = [req.body[_key]];
					}
					
					for (let i = 0; i < cnt; i++) {
						if (!req.body[_key][i]) {
							throw new Error(required[key]);
						}
					}
				}
			}
		});
		
		/** 여행자 정보 체크 E */
	} catch (err) {
		return alert(err.message, res);
	}
	
	next();
};