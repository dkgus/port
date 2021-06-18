$(function() {
	/** CKEDITOR 로드 */
	if ($("#contents").length > 0) {
		CKEDITOR.replace("contents");
		CKEDITOR.config.height=350;
	}
	
	/** 댓글 수정 */
	$(".comment_list .update").click(function() {
		
	});
	

});