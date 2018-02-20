<?php
namespace Inner\Model;
use Think\Model;
class OrderModel extends Model {
	protected $tableName = 'commission';
	public function showList($search,$pages) {
		$InnerId = session('innerId');
		$InnerMember = M('inner_member');
		$userArr = $InnerMember->field('user_id,is_recommender')->where('job_number='.$InnerId)->select();
		$userIds = array();
		foreach ($userArr as $item) {
			$userIds[] = $item['user_id'];
		}
		$where = array();
		if (isset($search['a.id']) && is_int($search['a.id'])) {
			$where['a.id'] = $search['a.id'];
		}

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
			$where['a.created'] = array('BETWEEN',array(strtotime($created_start),strtotime($created_end)+3600*24-1));
		}else if (isset($created_start)) {
			$where['a.created'] = array('egt',strtotime($created_start));
		}else if (isset($created_end)) {
			$where['a.created'] = array('elt',strtotime($created_end)+3600*24-1);
		}

		if (empty($userIds)) {
			return array('list'=>'','count'=>0);
		}
		$where['a.gainer'] = array('in',$userIds);
		$confModel = M('web_conf');
        $webconf = $confModel->where('id=1')->find();
		$count = $this
			->alias('a')
			->field("a.*,b.username as username")
			->join("user as b on a.user_id = b.id")
			->where($where)
			->count();
		$list = $this
			->alias('a')
			->field("a.*,b.username as username")
			->join("user as b on a.user_id = b.id")
			->where($where)
			->order($pages['sort'].' '.$pages['dir'])
			->limit(($pages['page']-1)*$pages['size'],$pages['size'])
			->select();
		$userModel = M('user');
		$commission = 0;
		$allList = $this
			->alias('a')
			->field("a.*,b.username as username")
			->join("user as b on a.user_id = b.id")
			->where($where)
			->select();
		for ($i = 0 ; $i < count($allList) ; $i ++) {
			$commission += $allList[$i]['commision'];
 		}
		return array('list'=>$list,'count'=>$count,'commission'=>$commission);
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