<?php
function getOption($start,$end) {
	if ($start > $end) {
		return false;
	}
	$html = "";
	for($i = $start ; $i <= $end ; $i ++) {
		$html .= "<option value='".$i."'>".$i."</option>";
	}
	return $html;
}
?>