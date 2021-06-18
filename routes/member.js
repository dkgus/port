const express = require('express');
const path = require('path');
const member = require("../models/member"); //데베 연결한 모델
const message = require("../lib/message");
const { joinFormValidator } = require("../middlewares/validators/join"); // 회원가입 양식 검증 미들웨어
const { loginFormValidator } = require("../middlewares/validators/login"); // 로그인 양식 검증 미들웨어
const { memberOnly, guestOnly } = require('../middlewares/member/member_check');
const { alert, go } = require('../lib/common');


const router = express.Router();




/** 회원가입  - /member/join */
router.route("/join")
      /* 회원가입 양식 */
      .get((req, res, next) => {
		const data = {
			addCss : ['member'],
			pageTitle : '회원가입',
		};
		res.render("member/form", data);

      })
      /** 회원 가입 처리 
       * 
       * 1. 유효성 검사 -> 미들웨어
	 * 2. member 모델 -> join 메서드
	 * 3. req.file
       */
      .post(joinFormValidator, async (req, res, next) => {
            try {
                  // 회원 가입 처리 
                  await member.join(req.body);
                  
                  // 가입 성공 -> 로그인 페이지로 이동 
                  return res.send("<script>location.href='/member/login';</script>");
            } catch (err) {
                  console.error(err);
                  next(err); // 에러처리 미들웨어로 이동 
            }
      });

/** 회원정보 수정 /member/info */
router.route("/info")
      /* 회원정보 수정 양식 */
      .get(async(req, res, next) => {
            
            let data ={};
            if(req.query.reserveNo){
                try{
                    const sql ="SELECT * FROM fly_member WHERE reserveNo = ?";
                    data = await sequelize.query(sql,{
                        replacements:[req.query.reserveNo],
                        type : QueryTypes.SELECT
                    });
                    data =data[0];
                    if (data) {
                        const date = new Date(data.reserveDt);
                        const year = date.getFullYear();
                        let month = date.getMonth() + 1;
                        month = (month < 10)?"0" + month:month;
                        let day = date.getDate();
                        day = (day < 10)?"0"+day:day;
                        data.reserveDt = `${year}-${month}-${day}`;
    
                    }
                }catch(err){
                    console.error(err);
                    next(err);
                }
    
               
            }
            

            res.render('reservation/form',{data});
      })
      /** 회원정보 수정 처리  */
      .post((req, res, next) => {

      });

/** 로그인  /member/login */
router.route("/login")
      /* 로그인 양식 */
      .get(guestOnly,(req, res, next) => {
			const data = {
				pageTitle : '로그인',
				addCss : ['member'],
			};
            res.render("member/login", data);
      })
      /** 로그인 처리  */
      .post(loginFormValidator, async (req, res, next) => {
            try {
                  const result = await member.login(req.body.memId, req.body.memPw, req);
                  if (result) { // 로그인 성공
                        return res.send("<script>location.href='/';</script>");
                  } else { // 로그인 실패 
                        throw new Error("로그인 실패!");
                  }
                  
            } catch (err) { // 로그인 실패 
                  return message.alertBack(err.message, res);
            }
      });


/** 
* 로그 아웃 처리 
*
*/
router.get("/logout", (req, res, next) => {
	req.session.destroy();
	delete req.member;
	delete res.locals.member;
	
	res.send("<script>location.href='/member/login';</script>");
});
module.exports = router;