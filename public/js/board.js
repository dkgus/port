$(function() {
	if ($(".body_board_view").length > 0) {
		initBoardView(); // 게시글 보기 
	}
	
	/** CKEDITOR 로드 */
	if ($("#contents").length > 0) {
		CKEDITOR.replace("contents");
		CKEDITOR.config.height=350;
	}
	
	/** 댓글 수정 */
	$(".comment_list .update").click(function() {
		const idx = $(this).closest(".comment").data("idx");
		layer.popup("/board/comment/" + idx, 450, 450);
	});
	
	/** 이미지 또는 파일  업로드 */
	$(".upload_image, .upload_file").click(function() {
		const obj = $(this).closest("form").find("input[name='gid']");
		if (obj.length == 0) return;
		
		const gid = obj.val();
		if (gid == '') return;
		
		
		let url = `/file/upload/${gid}`;
		if ($(this).hasClass("upload_image")) { // 이미지 업로드 
			url += "?mode=image";
		} else { // 파일 첨부
			url += "?isAttached=1";
		}
		
		layer.popup(url, 320, 250);
	});
	

	
	/** 이미지 에디터에 첨부 */
	$("body").on("click", ".file_box .addContents", function() {
		const fileUrl = $(this).closest(".file_box").data("url");
		const tag = `<img src='${fileUrl}'>`;
		CKEDITOR.instances.contents.insertHtml(tag);
	});
	
	/** 파일 삭제 */
	$("body").on("click", ".file_box .remove", function() {
		if (!confirm('정말 삭제하시겠습니까?')) {
			return;
		}
		
		const fileBox = $(this).closest(".file_box");
		const idx = fileBox.data("idx");
		axios.get("/file/delete/" + idx)
			  .then((res) => {
				  if (res.data.isSuccess) { // 파일 삭제 성공
					  fileBox.remove();
				  } else { // 파일 삭제 실패 
					  alert("파일 삭제 실패하였습니다.");
				  }
			  })
			  .catch((err) => {
				 console.error(err); 
			  });
	});
});

/**
* 파일 업로드 콜백 
*
* @params Object data 파일 업로드 후 데이터 
*/
function fileUploadCallback(data) {
	if (data.idx) {
		let html = `<span class='file_box' data-idx='${data.idx}' data-url='${data.fileUrl}'>
							<a href='/file/download/${data.idx}' target='ifrmHidden'>${data.fileName}</a>
							<i class='remove xi-file-remove'></i>`;
		if (data.mimeType.indexOf('image') != -1 && !data.isAttached) { // 에디터에 이미지 첨부 
			if ($("#contents").length > 0) {
				const tag = `<img src='${data.fileUrl}'>`;
				CKEDITOR.instances.contents.insertHtml(tag);
				html += `<i class='addContents xi-upload'></i>
							</span>`;
				$(".uploaded_images").append(html);
			}
		} else {
			html += `</span>`;
			$(".uploaded_files").append(html);
		}
		
		layer.close();
	}
}

/** 게시판 보기 초기화 */
function initBoardView() {
	const qs = {};
	location.search.replace("?", "")
						.split("&")
						.map((v) => {
							v = v.split("=");
							qs[v[0]] = v[1];
						});
	if (qs.comment_done) {
		const target = $(".comment_list #comment_" + qs.comment_done);
		const offset = target.offset();
		$("html, body").animate({scrollTop : offset.top - 60 + "px"}, 300);
	}
	
	 // 댓글 수정 비밀번호 확인이 완료 된 경우는 수정 팝업 보이기
	if (qs.idx_comment) {
		layer.popup("/board/comment/" + qs.idx_comment, 450, 450);
	}
}