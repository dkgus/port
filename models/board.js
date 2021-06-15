const { sequelize, Sequelize : { QueryTypes } } = require('./index');
const logger = require('../lib/logger');
const path = require('path');
const fs = require('fs').promises;
const { parseDate } = require('../lib/common');
const bcrypt = require('bcrypt');
const pagination = require('pagination');

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
			
			let category = this.params.category;
			if (category) {
				category = category.replace(/\r\n/g, "||");
			}
			
			const replacements = {
					boardNm : this.params.boardNm,
					category,
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
	},
	/**
	* 게시글 작성 
	*
	* @return Integer|Boolean 글 작성 성공시 게시글번호 idx, 실패시 boolean 
	*/
	write : async function() {
		try {
			const memNo = this.session.memNo || 0;
			let hash = "";
			if (!memNo && this.params.password) {
				hash = await bcrypt.hash(this.params.password, 10);
			}
			
			const sql = `INSERT INTO fly_boarddata 
									(gid, boardId, category, memNo, poster, subject, contents, password, ip)
									VALUES (:gid, :boardId, :category, :memNo, :poster, :subject, :contents, :password, :ip)`;
			
			
			const replacements = {
				gid : this.getUid(),
				boardId : this.params.id,
				category : this.params.category,
				memNo,
				poster : this.params.poster,
				subject : this.params.subject,
				contents : this.params.contents,
				password : hash,
				ip : this.params.ip,
			};
	
			const result = await sequelize.query(sql, {
				replacements,
				type : QueryTypes.INSERT,
			});
			
			return result[0]; 
		} catch (err) {
			logger(err.message);
			return false;
		}
	},
	/**
	* Unique Id 생성 
	*
	* @return Integer
	*/
	getUid : function() {
		return new Date().getTime();
	},

	/**
	* 게시글 수정 
	*
	* @return Boolean
	*/
	update : async function() {
		try {
			let hash = "";
			if (!this.session.memNo && this.params.password) {
				hash = await bcrypt.hash(this.params.password, 10);
			}
			
			const sql = `UPDATE fly_boarddata 
									SET 
										category = :category,
										poster = :poster,
										subject = :subject,
										contents = :contents,
										password = :password,
										modDt = :modDt
									WHERE 
										idx = :idx`;
			const replacements = {
					category : this.params.category,
					poster : this.params.poster,
					subject : this.params.subject,
					contents : this.params.contents,
					password : hash,
					modDt : new Date(),
					idx : this.params.idx,
			};
			
			await sequelize.query(sql, {
				replacements,
				type : QueryTypes.UPDATE,
			});
			
			return true;
		} catch (err) {
			logger(err.stack, 'error');
			return false;
		}
	},
	/**
	* 게시글 삭제 
	*
	* @param Integer idx 게시글 번호
	* @return Boolean 
	*/
	delete : async function(idx) {
		try {
			const sql = "DELETE FROM fly_boarddata WHERE idx = ?";
			await sequelize.query(sql, {
				replacements : [idx],
				type : QueryTypes.DELETE,
			});
			
			return true;
		} catch (err) {
			logger(err.stack, 'error');
			return false;
		}
	},
	/**
	* 게시글 조회
	*
	* @param Integer idx 게시글 번호
	* @return Object
	*/
	get : async function(idx) {
		try {
			const sql = `SELECT a.*, b.memId, b.memNm FROM fly_boarddata AS a 
										LEFT JOIN fly_member AS b ON a.memNo = b.memNo 
									WHERE a.idx = ?`;
			const rows = await sequelize.query(sql, {
					replacements : [idx],
					type : QueryTypes.SELECT,
			});
			
			const data = rows[0] || {};
			if (data) {
				data.regDt = parseDate(data.regDt).datetime;
				data.config = await this.getBoard(data.boardId);
				data.id = data.boardId;
			}
	
			return data;
		} catch (err) {
			logger(err.stack, 'error');
			return {};
		}
	},
	/**
	* 게시글 목록 조회 
	*
	* @param String boardId 게시판 아이디 
	* @param Integer page  페이지번호, 기본값 1 
	* @param Integer limit 1페이당 레코드 수 
	* @param Object qs - req.query 
	* 
	* @return Object
	*/
	getList : async function(boardId, page, limit, qs) {
		try { 
			page = page || 1;
			limit = limit || 20;
			const offset = (page - 1) * limit;
			
			let prelink = "/board/list/" + boardId;
			if (qs) {
				const addQs = [];
				for (key in qs) {
					if (key == 'page') continue; 
					addQs.push(key + "=" + qs[key]);
				} // endfor 
				
				prelink += "?" + addQs.join("&");
			} // endif 
			
			const replacements = {
				boardId,
			};
			
			let sql = `SELECT COUNT(*) as cnt FROM fly_boarddata AS a 
								LEFT JOIN fly_member AS b ON a.memNo = b.memNo 
							WHERE a.boardId = :boardId`;
			
			const rows = await sequelize.query(sql, {
				replacements,
				type : QueryTypes.SELECT,
			});
			
			const totalResult = rows[0].cnt;
			
			const paginator = pagination.create('search', {prelink, current: page, rowsPerPage: limit, totalResult});
			
			
			replacements.limit = limit;
			replacements.offset = offset;
			
			sql = `SELECT a.*, b.memNm, b.memId FROM fly_boarddata AS a 
							LEFT JOIN fly_member AS b ON a.memNo = b.memNo 
						WHERE a.boardId = :boardId ORDER BY a.regDt DESC LIMIT :offset, :limit`;
			
			const list = await sequelize.query(sql, {
				replacements,
				type : QueryTypes.SELECT,
			});

			list.forEach((v, i, _list) => {
				_list[i].regDt = parseDate(v.regDt).datetime;
			});
			console.log("after", list);
			const data = {
				pagination : paginator.render(),
				page,
				limit,
				totalResult,
				offset,
				list,
			};
			
			return data;
		} catch (err) {
			logger(err.stack, 'error');
			return {};
		}
	}
};

module.exports = board;