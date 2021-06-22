const express = require('express');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const dotenv =require('dotenv');
const methodOverride =require('method-override');
const path = require('path');
const app  = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { sequelize } = require('./models');
const logger = require('./lib/logger');
const { mainMenu } = require('./middlewares/menus'); // 메인 메뉴 
const { loginSession } = require('./middlewares/member/login_session'); // 로그인 세션 처리 
const { bodyClass } = require('./middlewares/body_class'); // bodyClass 추가 미들웨어 

/** 라우터 */
const indexRouter = require('./routes');
const memberRouter = require('./routes/member');
const reservationRouter = require('./routes/reservation');
const boardRouter = require('./routes/board');
const fileRouter = require('./routes/file'); // 파일 업로드 페이지
const travelRouter = require('./routes/travel'); // 여행 상품 페이지 
const mypageRouter = require('./routes/mypage'); // 마이페이지 

/** 관리자 라우터 */
const adminRouter = require('./routes/admin'); // 관리자 메인 
const adminMemberRouter = require('./routes/admin/member'); // 회원관리
const adminBoardRouter = require('./routes/admin/board'); // 게시판 관리
const adminTravelRouter = require('./routes/admin/travel'); // 여행 상품관리 
const adminReservationRouter = require('./routes/admin/reservation'); //여행 예약관리 

dotenv.config();


app.set('port',process.env.PORT || 1112);

app.set('view engine', 'html');
nunjucks.configure('views', {
	express : app,
	watch : true,
});



sequelize.sync({ force : false })
		.then(() => {
			logger("데이터베이스 연결 성공");
		})
		.catch((err) => {
			logger(err.message, 'error');
			logger(err.stack, 'error');
		});



app.use(morgan('dev'));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public'))); //기본경로로 생략가능함
app.use(express.json());
app.use(express.urlencoded({ extended : false})); //post사용

app.use(cookieParser(process.env.COOKIE_SECRET)); 

app.use(session({
	resave : false, 
	saveUninitialized : true,
	secret : process.env.COOKIE_SECRET,
	cookie : {
		httpOnly : true, 
		secure : false, 
	},
	name : "YHSESSID",
}));



app.use(bodyClass); // bodyClass 
app.use(loginSession); // 로그인 세션 처리
app.use(mainMenu); // 메인메뉴 


/** 라우터 등록 */
app.use(indexRouter); // 메인 라우터 
app.use("/member", memberRouter); // 회원 관련 라우터
app.use("/board", boardRouter); // 게시판 관련 라우터 
app.use("/reservation", reservationRouter); // 예약 관련 라우터
app.use("/file", fileRouter); //파일 업로드 페이지 
app.use("/travel", travelRouter); // 여행 페이지
app.use("/mypage", mypageRouter); // 마이페이지

/** 관리자 */
app.use("/admin", adminRouter); // 관리자 메인
app.use('/admin/member', adminMemberRouter); // 회원관리
app.use('/admin/board', adminBoardRouter); // 게시판 관리
app.use('/admin/travel', adminTravelRouter); // 여행 상품관리
app.use('/admin/reservation', adminReservationRouter); // 여행 예약관리

app.use((req, res, next) => {
	
	const error = new Error(`${req.method} ${req.url}은 없는 페이지 입니다.`);
	error.status = 404;
	next(error); 
});


app.use((err, req, res, next) => {
	
	err.status = err.status || 500;

	logger(err.message, 'error');
	logger(err.stack, 'error');
	if (process.env.NODE_ENV == 'production') err.stack = "";

	res.locals.error = err;
	const data = {
		addCss : ['error'],
	};
	res.status(err.status).render("error", data); // error.html
});



app.listen(app.get('port'),()=>{
    console.log(app.get('port'), '번 포트에서 대기중');
});