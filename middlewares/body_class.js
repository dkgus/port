/**
* URL에 따른 body 클래스 추가 미들웨어 
*
*/
module.exports.bodyClass = (req, res, next) => {
	/* body 클래스 자동 완성(url 기준) */
	let url = req.url;
	let end = url.indexOf("?");
	if (end !== -1) {
		url = url.slice(0,end);
	}
	end = url.indexOf("#");
	if (end !== -1) {
		url = url.slice(0,end);
	}
	
	let addClass = "";
	if (url == '/') { 
		addClass = "main";
		res.locals.isMainPage = true;
	} else {
		url = url.split("/");
		if (url.length > 2) {
			addClass = url[1] + "_" + url[2];
		} else {
			addClass = url[1];
		}
	}
	
	res.locals.bodyClass = addClass;
	next();
};