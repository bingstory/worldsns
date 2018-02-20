<?php
namespace Admin\Model;
use Think\Model;
class GiftRecordModel extends Model {
	protected $tableName = 'user_gift';
	public function showList($search,$pages) {
		$where = array();
		if (isset($search['id']) && is_int($search['id'])) {
			$where['id'] = $search['id'];
		}
		if (isset($search['sender'])) {
			$where['b.username'] = array('like','%'.$search['sender'].'%'); 
		}
		if (isset($search['reciver'])) {
			$where['c.username'] = array('like','%'.$search['reciver'].'%'); 
		}
		if (isset($search['created_start']) && isset($search['created_end'])){
			$where['a.created'] = array('BETWEEN',array(strtotime($search['created_start']),strtotime($search['created_end'])+3600*24-1));
		}else if (isset($search['created_start'])) {
			$where['a.created'] = array('egt',strtotime($search['created_start']));
		}else if (isset($search['created_end'])) {
			$where['a.created'] = array('elt',strtotime($search['created_end'])+3600*24-1);
		}
		$where['d.type'] = 'real'; 
		$count = $this
			->alias('a')
			->field('a.*,b.id as b_id,b.username as sender_name,c.id as c_id,c.username as rerciver_name,d.id as d_id,d.name as gift_name')
			->join('user as b on a.sender_id = b.id')
			->join('user as c on a.reciver_id = c.id')
			->join('gift as d on a.gift_id = d.id')
			->where($where)
			->count();
		$list = $this
			->alias('a')
			->field('a.*,b.id as b_id,b.username as sender_name,c.id as c_id,c.username as rerciver_name,c.email as rerciver_email,c.name as realname,d.id as d_id,d.name as gift_name')
			->join('user as b on a.sender_id = b.id')
			->join('user as c on a.reciver_id = c.id')
			->join('gift as d on a.gift_id = d.id')
			->where($where)
			->order($pages['sort'].' '.$pages['dir'])
			->limit(($pages['page']-1)*$pages['size'],$pages['size'])
			->select();
		$innerModel =  M('inner_member');
		for ($i = 0 ; $i < count($list) ; $i ++) {
			$worker = $innerModel->alias('a')->join('employee as b on a.job_number = b.id')->where('a.user_id='.$list[$i]['reciver_id'])->getField('b.name');
			$list[$i]['employee'] = $worker;
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