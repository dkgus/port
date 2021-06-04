module.exports = {
	/**
	* 알림 호출 
	*
	* @param String msg 메세지
	* @param Object res - Response 객체 
	*/
	alert : (msg, res) => {		
		res.send(`<script>alert("${msg}");</script>`);
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