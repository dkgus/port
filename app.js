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

/** 라우터 */
const indexRouter = require('./routes');
const memberRouter = require('./routes/member');
const reservationRouter = require('./routes/reservation');
const boardRouter = require('./routes/board');

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


app.use(cookieParser(process.env.COOKIE_SECRET)); 

app.use(session({
	resave : false, 
	saveUninitialized : false,
	secret : process.env.COOKIE_SECRET,
	cookie : {
		httpOnly : true, 
		secure : false, 
	},
	name : "YHSESSID",
}));



app.use(morgan('dev'));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public'))); //기본경로로 생략가능함


app.use(express.json());
app.use(express.urlencoded({ extended : false})); //post사용

app.use(mainMenu); // 메인메뉴 

/** 라우터 등록 */
app.use(indexRouter); // 메인 라우터 
app.use("/member", memberRouter); // 회원 관련 라우터
app.use("/reservation", reservationRouter); // 예약 관련 라우터
app.use("/board", boardRouter); // 게시판 관련 라우터 

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