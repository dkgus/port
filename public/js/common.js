  
$(function() {
	$("body").on("change", ".file_upload_form input[type='file']", function() {
		$(this).closest("form").submit();
	});
	
	/** 상품코드 자동생성 */
	$(".generate_goodsCd").click(function() {
		
	});
});