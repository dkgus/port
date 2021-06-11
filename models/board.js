const { sequelize, Sequelize : { QueryTypes } } = require('./index');
const logger = require('../lib/logger');
const path = require('path');
const fs = require('fs').promises;

/**
* 게시판 Model
*
*/
const board = {
	params : {}, // 처리할 데이터 
	session : {}, // 처리할 세션 데이터 
	
	/**
	* 게시판 생성 
	*
	* @param String id 게시판 아이디
	* @param String boardNm 게시판이름
	*
	* @return Boolean 생성 성공 true
	*/
	create : async function(id, boardNm) {
		try {
			if (!id || !boardNm) {
				throw new Error('게시판 아이디 또는 게시판명 누락');
			}
			
			const sql = "INSERT INTO fly_board (id, boardNm) VALUES (:id, :boardNm)";
			const replacements = {
					id,
					boardNm,
			};
			await sequelize.query(sql, {
				replacements,
				type : QueryTypes.INSERT,
			});
			
			return true;
		} catch (err) {
			logger(err.stack, 'error');
			return false;
		}
	},
	/** 
	* 게시판 목록 
	*
	* @return Object
	*/
	getBoards : async function() {
		try {
			const sql = 'SELECT * FROM fly_board ORDER BY regDt DESC';
			const rows = await sequelize.query(sql, {
				type : QueryTypes.SELECT,
			});
			
			return rows;
		} catch (err) {
			logger(err.stack, 'error');
			return [];
		}
	},
	/**
	* 게시판 설정 조회
	*
	* @param String id 게시판 아이디 
	* @return Object
	*/
	getBoard : async function(id) {
		try {
			const sql = "SELECT * FROM fly_board WHERE id = ?";
			let rows = await sequelize.query(sql, {
					replacements : [id],
					type : QueryTypes.SELECT,
			});
			
			data = rows[0] || {};
			if (rows.length > 0) {
				/* 
				* category는 db에  분류1||분류2||분류3으로 저장되고 이를 ||로 분리하여 배열 객체 형태로 가공하여 사용
				* 설정 저장 form에서는 줄 개행문자 \r\n으로 붙여서 textarea에서 줄개행 형태로 보이도록 처리 
				*
				*
				* 게시판 스킨은 
				*			views/board/skins의 하위 폴더의 명칭이 skin 이름이 된다.
				*/
				
				if (data.category) {
					data.categories = data.category.split("||");
					data.category = data.categories.join("\r\n");
				}
				
				/* 스킨 목록 추출 */
				data.skins = await this.getSkins();
				
				/** 스킨 작성양식, 목록, 조회 경로 */
				data.skinPath = {};
				if (data.skin) {
					const skinRootPath = path.join(__dirname, `../views/board/skins/${data.skin}`);
					data.skinPath.list = skinRootPath + "/_list.html";
					data.skinPath.view = skinRootPath + "/_view.html";
					data.skinPath.form = skinRootPath + "/_form.html";
				}
			}
			
			return data;
		} catch (err) {
			logger(err.stack, 'error');
			return {};
		}
	},
	/**
	* 게시판 스킨 목록 조회 
	*
	* @return Array
	*/
	getSkins : async function() {
		try {
			const dirs = await fs.readdir(path.join(__dirname, '../views/board/skins'));
			return dirs;
		} catch (err) {
			logger(err.stack, 'error');
			return [];
		}
	},
	/**
	* 처리할 데이터 설정 
	*
	* @param Object params - 처리할 데이터(예 - req.body ... )
	* @param Object session - 처리할 세션 데이터
	*
	* return this
	*/
	data : function(params, session) {
		this.params = params;
		this.session = session;
		
		return this;
	},
	/**
	* 설정 저장 
	*
	* @return Boolean
	*/
	save : async function() {
		try {
			const sql = `UPDATE fly_board 
								SET 
									boardNm = :boardNm, 
									category = :category, 
									accessType = :accessType, 
									useImageUpload = :useImageUpload, 
									useFileUpload = :useFileUpload, 
									skin = :skin
								WHERE
									id = :id`;
			
			const replacements = {
					boardNm : this.params.boardNm,
					category : this.params.category,
					accessType : this.params.accessType,
					useImageUpload : this.params.useImageUpload,
					useFileUpload : this.params.useFileUpload,
					skin : this.params.skin,
					id : this.params.id,
			};
			await sequelize.query(sql, {
				replacements,
				type : QueryTypes.INSERT,
			});
			
			return true;
		} catch (err) {
			logger(err.stack, 'error');
			return false;
		}
	}
};

module.exports = board;