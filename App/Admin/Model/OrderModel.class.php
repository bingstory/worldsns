<?php
namespace Admin\Model;
use Think\Model;
class OrderModel extends Model {
	protected $tableName = 'order_record';
	public function showList($search,$pages) {
		$where = array();
		if (isset($search['id']) && is_int($search['id'])) {
			$where['id'] = $search['id'];
		}
		if (isset($search['pay_type']) && $search['pay_type'] != 'all') {
			$where['pay_type'] = $search['pay_type'];
		}
		if (isset($search['goods_type']) && $search['goods_type'] != 'all') {
			$where['goods_type'] = $search['goods_type'];
		}
		if (isset($search['pay_status']) && $search['pay_status'] != 'all') {
			$where['pay_status'] = $search['pay_status'];
		}
		if (isset($search['created_start']) && isset($search['created_end'])){
			$where['created'] = array('BETWEEN',array(strtotime($search['created_start']),strtotime($search['created_end'])+3600*24-1));
		}else if (isset($search['created_start'])) {
			$where['created'] = array('egt',strtotime($search['created_start']));
		}else if (isset($search['created_end'])) {
			$where['created'] = array('elt',strtotime($search['created_end'])+3600*24-1);
		}

		if (isset($search['updated_start']) && isset($search['updated_end'])){
			$where['updated'] = array('BETWEEN',array(strtotime($search['updated_start']),strtotime($search['updated_start'])+3600*24-1));
		}else if (isset($search['updated_start'])) {
			$where['updated'] = array('egt',strtotime($search['updated_start']));
		}else if (isset($search['updated_end'])) {
			$where['updated'] = array('elt',strtotime($search['updated_start'])+3600*24-1);
		}
		$count = $this->where($where)->count();
		$list = $this->where($where)->order($pages['sort'].' '.$pages['dir'])->limit(($pages['page']-1)*$pages['size'],$pages['size'])->select();
		$userModel = M('user');
		for ($i = 0 ; $i < count($list) ; $i ++) {
			$list[$i]['username'] = $userModel->where('id='.$list[$i]['user_id'])->getField('username');
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