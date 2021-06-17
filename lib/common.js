/**
* 공통 라이브러리 
*
*/
const commonLib = {
	/**
	* Date 생성자 toString 형태를 년, 월, 일, 요일로 분해해서 반환
	*
	*/
	parseDate : function(dateStr) {
		const date = new Date(dateStr);
		const year = date.getFullYear();
		let month = date.getMonth() + 1;
		month = (month < 10)?"0"+month:month;
		let day = date.getDate();
		day = (day < 10)?"0"+day:day;
		
		let hours = date.getHours();
		hours = (hours < 10)?"0"+hours:hours;
		
		let mins = date.getMinutes();
		mins = (mins < 10)?"0"+mins:mins;
		
		let secs = date.getSeconds();
		secs = (secs < 10)?"0"+secs:secs;
		
		//const yoil = this.getYoil(date.getDay());
		
		const str = `${year}.${month}.${day}`;
		const str2 = `${year}.${month}.${day} ${hours}:${mins}`;
		
		return {year, month, day, date : str, datetime : str2 };
	},
	/**
	* 요일 
	*
	*/
	getYoils : function() {
		return ["일", "월", "화", "수", "목", "금", "토"];
	},
	/**
	* 요일 index 번호에 해당하는 요일 반환
	*
	*/
	getYoil : function(yoilIndex) {
		if (typeof yoilIndex == 'undefined') {  // yoilIndex를 지정하지 않으면 오늘 요일 
			yoilIndex = new Date().getDay();
		}
		
		const yoils = this.getYoils();
		
		return yoils[yoilIndex];
	},
};

module.exports = commonLib;