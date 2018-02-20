<?php
namespace Admin\Model;
use Think\Model;
class UpgradeModel extends Model {
	protected $tableName = 'upgrade_record';
	public function showList($search,$pages) {
		$where = array();
		if (isset($search['id']) && is_int($search['id'])) {
			$where['a.id'] = $search['id'];
		}
		if (isset($search['target'])) {
			$where['b_username'] = array('like','%'.$search['target'].'%');
		}
		if (isset($search['source'])) {
			$where['c_username'] = array('like','%'.$search['source'].'%');
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
		$list = $this->field(array('a.*','b.id'=>'b_id','b.username'=>'b_username','c.id'=>'c_id','c.username'=>'c_username','d.id'=>'d_id','d.name'=>'d_name'))
			->alias('a')
			->join('user b ON b.id = a.target_id')
			->join('user c ON c.id = a.source_id')
			->join('member d ON d.id = a.type_id')
			->where($where)->order($pages['sort'].' '.$pages['dir'])->limit(($pages['page']-1)*$pages['size'],$pages['size'])->select();
		$count = count($list); 
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