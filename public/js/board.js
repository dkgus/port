$(function() {
	/** CKEDITOR 로드 */
	if ($("#contents").length > 0) {
		CKEDITOR.replace("contents");
		CKEDITOR.config.height=350;
	}
});