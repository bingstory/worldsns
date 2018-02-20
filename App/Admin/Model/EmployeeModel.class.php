<?php
namespace Admin\Model;
use Think\Model;
class EmployeeModel extends Model {
	public function showList($search,$pages) {
		$where = array();
		if (isset($search['job_number'])) {
			$where['job_number'] = array('like','%'.$search['job_number'].'%');
		}
		if (isset($search['name'])) {
			$where['name'] = array('like','%'.$search['name'].'%');
		}
		$commisionBool = false;
		$count = $this->where($where)->count();
		if ($pages['sort'] == 'commision') {
			$commisionBool = true; 
			$pages['sort'] = 'id';  
		}
		$list = $this->where($where)->order($pages['sort'].' '.$pages['dir'])->limit(($pages['page']-1)*$pages['size'],$pages['size'])->select();
		//var_dump($list);
		$webconfModel = M('web_conf');
		$webconf = $webconfModel->where('id=1')->find();
		$innerModel = M('inner_member');
		$commissionModel = M('commission');
		for ($i = 0 ; $i < count($list); $i ++) {
			$users = $innerModel->field('user_id,is_recommender')->where('job_number='.$list[$i]['id'])->select();

			$userIds = array();
			foreach($users as $item) {
				$userIds[] = $item['user_id'];
			}
			if (!empty($userIds)) {
				$commissionWhere = array('gainer'=>array('in',$userIds),'pay_status'=>4);
				$timeStr = '';
				if ((isset($search['year']) && $search['year'] != 0) && (isset($search['month']) && $search['month'] != 0)) {
			$created_start = $search['year'].'-'.$search['month'].'-1';
			if (in_array($search['month'], array(1,3,5,7,8,10,12))) {
				$created_end = $search['year'].'-'.$search['month'].'-31';
			}elseif (in_array($search['month'], array(4,6,9,11))) {
				$created_end = $search['year'].'-'.$search['month'].'-30';
			}elseif ($search['month'] == 2) {
				if ($search['year'] % 4 == 0 || ($search['year'] % 100 == 0 && $search['year'] % 400 == 0)) {
					$created_end = $search['year'].'-'.$search['month'].'-29';
				}else{
					$created_end = $search['year'].'-'.$search['month'].'-28';
				}
			}
		}elseif (isset($search['year']) && $search['year'] != 0) {
			$created_start = $search['year'].'-1-1';
			$created_end = $search['year'].'-12-31';
		}elseif (isset($search['month']) && $search['month'] != 0) {
			$yearNow = date('Y');
			$created_start = $yearNow.'-'.$search['month'].'-1';
			if (in_array($search['month'], array(1,3,5,7,8,10,12))) {
				$created_end = $yearNow.'-'.$search['month'].'-31';
			}elseif (in_array($search['month'], array(4,6,9,11))) {
				$created_end = $yearNow.'-'.$search['month'].'-30';
			}elseif ($search['month'] == 2) {
				if ($yearNow % 4 == 0 || ($yearNow % 100 == 0 && $yearNow % 400 == 0)) {
					$created_end = $yearNow.'-'.$search['month'].'-29';
				}else{
					$created_end = $yearNow.'-'.$search['month'].'-28';
				}
			} 
		}elseif (empty($search['year']) && empty($search['month'])) {
			$date = date("Y-m");
			$dateArr = explode('-', $date);
			$created_start = $dateArr[0].'-'.$dateArr[1].'-1';
			if ($dateArr[1] == 2) {
				if ($dateArr[0] % 4 == 0 || ($dateArr[0] % 100 == 0 && $dateArr[0] % 400 == 0)) {
					$created_end = $dateArr[0].'-'.$dateArr[1].'-29';
				}else{
					$created_end = $dateArr[0].'-'.$dateArr[1].'-28';
				}
			}elseif(in_array($dateArr[1], array(1,3,5,7,8,10,12))){
				$created_end = $dateArr[0].'-'.$dateArr[1].'-31';
			}elseif(in_array($dateArr[1], array(4,6,9,11))){
				$created_end = $dateArr[0].'-'.$dateArr[1].'-30';
			}
		} 
				if (isset($created_start) && isset($created_end)){
					$commissionWhere['created'] = array('BETWEEN',array(strtotime($created_start),strtotime($created_end)+3600*24-1));
				}else if (isset($created_start)) {
					$commissionWhere['created'] = array('egt',strtotime($created_start));
				}else if (isset($created_end)) {
					$commissionWhere['created'] = array('elt',strtotime($created_end)+3600*24-1);
				}
				$amount = $commissionModel->where($commissionWhere)->getField("SUM(commision)");
				$list[$i]['commission'] = round($amount,5);
			}else{
				$list[$i]['commission'] = 0;
			}
		}
		if ($commisionBool) {
			if ($pages['dir'] == 'asc') {
				for ($i = 0 ; $i < count($list) -1 ; $i ++) {
					for ($j = $i ; $j < count($list) ; $j ++) {
						if ($list[$i]['commission'] > $list[$j]['commission']) {
							$temp = $list[$i];
							$list[$i] = $list[$j];
							$list[$j] = $temp; 
						}
					}
				}
			}elseif ($pages['dir'] == 'desc') {
				for ($i = 0 ; $i < count($list) -1 ; $i ++) {
					for ($j = $i ; $j < count($list) ; $j ++) {
						if ($list[$i]['commission'] < $list[$j]['commission']) {
							$temp = $list[$i];
							$list[$i] = $list[$j];
							$list[$j] = $temp; 
						}
					}
				}
			}
		}
		return array('list'=>$list,'count'=>$count);
	}
	/**
	*	批量删除
	* @param 	$ids ID数组，要删除的数据项的ID
	* @return  	$res 删除结果
	*/
	public function batchDelete($ids = array()){

		if (!$ids || !count($ids)) {
			return false;	
		}
		$totalArr = array();
		$successArr = array();
		$failedArr = array();
		foreach ($ids as $key => $id) {
			$totalArr[] = $id;
			$res = $this->where(array('id'=>$id))->delete();
			if ($res) {
				$successArr[]= $id;
			}else{
				$failedArr[] = $id;
			}
		}

		return array(
			'totalarr' => $totalArr ,
			'successArr' => $successArr,
			'failedArr' => $failedArr ,
			);
	}
}
?>