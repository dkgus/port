module.exports = {
	/**
	* 메세지 출력 
	*
	* @param String msg 알림 메세지
	* @param Object res  Response 객체
	* @param Integer|String action
	*						Integer(정수) -> history.go(정수)
	*						String(링크) -> location.href
	* @param String target 기본값 self, 
	*/
	alert : function(msg, res, action, target) {
		target = target || 'self';
		
		let script = `<script>alert("${msg}");`;
		if (action) {
			if (isNaN(action)) { // 이동 
				if (action == 'reload') { // 새로고침
					script += `${target}.location.reload();`;
				} else { // 페이지 이동 
					script += `${target}.location.href='${action}';`;//alert으로 접근 불가를 띄우고 정해진 특정 페이지(
				}
			} else { // history.go
				script += `${target}.history.go(${action});`;//이전 또는 이후 페이지의 이동이 가능 사용방법은 전달할 인자에 숫자를 넣어 이동하게 됩니다. 
			}
		} 
		script += "</script>";

		return res.send(script);
	},
	/**
	* 페이지 이동 
	*
	*/
	go : function(url, res, target) {
		target = target || 'self';
		return res.send(`<script>${target}.location.href='${url}';</script>`);
	},
	/**
	* 페이지 뒤로가기 
	*
	*/
	back : function(res, target) {
		target = target || 'self';
		return res.send(`<script>${target}.history.back();</script>`);
	},
	/**
	* 페이지 앞으로 가기
	*
	*/
	forward : function(res, target) {
		target = target || 'self';
		return res.send(`<script>${target}.history.forward();</script>`);
	},
	/**
	* 페이지 새로고침
	*
	*/
	reload : function(res, target) {
		target = target || 'self';
		return res.send(`<script>${target}.location.reload();</script>`);
	},
	/**
	* 알림 호출 후 뒤로 가기(history.back())
	*
	* @param String msg 메세지
	* @param Object res - Response 객체 
	*/
	alertBack : (msg, res) => {
		res.send(`<script>alert("${msg}");history.back();</script>`);
	}
};