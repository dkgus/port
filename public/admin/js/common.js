$(function() {
	/** 전체 선택 */
	$(".check_all").click(function() {
		const target = $(this).data("target-name");
		$(this).closest("form").find("input[name='" + target + "']").prop("checked", $(this).prop("checked"));
	});
});