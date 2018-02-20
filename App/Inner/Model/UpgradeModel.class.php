<?php
namespace Inner\Model;
use Think\Model;
class UpgradeModel extends Model {
	protected $tableName = 'upgrade_record';
	public function showList($search,$pages) {
		$InnerId = session('innerId');
		$InnerMember = M('inner_member');
		$userArr = $InnerMember->field('user_id')->where('inner_id='.$InnerId)->select();
		$userIds = array();
		foreach ($userArr as $item) {
			$userIds[] = $item['user_id'];
		}
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
		if (empty($userIds)) {
			return array('list'=>'','count'=>0);
		}
		$where['source_id'] = array('in',$userIds);
		$list = $this->field(array('a.*','b.id'=>'b_id','b.username'=>'b_username','c.id'=>'c_id','c.username'=>'c_username','d.id'=>'d_id','d.name'=>'d_name'))
			->alias('a')
			->join('user b ON b.id = a.target_id')
			->join('user c ON c.id = a.source_id')
			->join('member d ON d.id = a.type_id')
			->where($where)->order($pages['sort'].' '.$pages['dir'])->limit(($pages['page']-1)*$pages['size'],$pages['size'])->select();
		$count = count($list); 
		return array('list'=>$list,'count'=>$count);
	}
}
?>