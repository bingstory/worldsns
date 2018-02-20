function exportExcel (tableId) {
	$("#"+tableId).tableExport({type:'excel', separator:';', escape:'false'});
}
function exportData () {
	$('#testtable').tableExport({type:'excel', separator:';', escape:'false'});
}