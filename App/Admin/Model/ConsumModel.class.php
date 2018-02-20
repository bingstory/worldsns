<?php
namespace Admin\Model;
use Think\Model;
class ConsumModel extends Model {
	protected $tableName = 'order_record';
	public function showList($search,$pages) {
		$where = array();
		if (isset($search['id']) && is_int($search['id'])) {
			$where['a.id'] = $search['id'];
		}
		if (isset($search['username'])) {
			$where['b.username'] = array('like','%'.$search['username'].'%'); 
		}
		if (isset($search['pay_type']) && $search['pay_type'] != 'all') {
			$where['a.pay_type'] = $search['pay_type'];
		}
		if (isset($search['created_start']) && isset($search['created_end'])){
			$where['a.created'] = array('BETWEEN',array(strtotime($search['created_start']),strtotime($search['created_end'])+3600*24-1));
		}else if (isset($search['created_start'])) {
			$where['a.created'] = array('egt',strtotime($search['created_start']));
		}else if (isset($search['created_end'])) {
			$where['a.created'] = array('elt',strtotime($search['created_end'])+3600*24-1);
		}

		$where['a.goods_type'] != 'recharge';
		$where['a.pay_type'] = 'gold';
		$count = $this->field(array('a.*','b.id'=>'b_id','b.username'=>'username','c.id'=>'c_id','c.username' => 'gainername'))
			->alias('a')
			->join('user b ON b.id = a.user_id')
			->join('user c ON c.id = a.gainer')
			->where($where)
			->count();
		$list = $this->field(array('a.*','b.id'=>'b_id','b.username'=>'username','c.id'=>'c_id','c.username' => 'gainername'))
			->alias('a')
			->join('user b ON b.id = a.user_id')
			->join('user c ON c.id = a.gainer')
			->where($where)
			->order($pages['sort'].' '.$pages['dir'])->limit(($pages['page']-1)*$pages['size'],$pages['size'])->select();
		$userModel = M('user');
		$amount = $this->field(array('a.*','b.id'=>'b_id','b.username'=>'username','c.id'=>'c_id','c.username' => 'gainername'))
			->alias('a')
			->join('user b ON b.id = a.user_id')
			->join('user c ON c.id = a.gainer')
			->where($where)
			->getField("SUM(amount)");
		return array('list'=>$list,'count'=>$count,'amount'=>$amount);
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