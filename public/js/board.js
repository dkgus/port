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
});

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