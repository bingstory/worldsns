<?php
namespace Inner\Model;
use Think\Model;
class UserModel extends Model {
	public function showList($search,$pages) {
		$InnerId = session('innerId');
		$InnerMember = M('inner_member');
		$userArr = $InnerMember->field('user_id')->where('job_number='.$InnerId)->select();
		$userIds = array();
		foreach ($userArr as $item) {
			$userIds[] = $item['user_id'];
		}
		$where = array();
		if (isset($search['username'])) {
			$where['username'] = array('like','%'.$search['username'].'%');
		}
		if (isset($search['created_start']) && isset($search['created_end'])){
			$where['created'] = array('BETWEEN',array(strtotime($search['created_start']),strtotime($search['created_end'])+3600*24-1));
		}else if (isset($search['created_start'])) {
			$where['created'] = array('egt',strtotime($search['created_start']));
		}else if (isset($search['created_end'])) {
			$where['created'] = array('elt',strtotime($search['created_end'])+3600*24-1);
		}
		if (empty($userIds)) {
			return array('list'=>'','count'=>0);
		}
		$where['id'] = array('in',$userIds);
		if (isset($search['id']) && is_int($search['id'])) {
			if (in_array($search['id'], $userIds)) {
				$where['id'] = $search['id'];
			}else{
				$where['id'] = 0;
			}
		}
		$count = $this->where($where)->count();
		$list = $this->where($where)->order($pages['sort'].' '.$pages['dir'])->limit(($pages['page']-1)*$pages['size'],$pages['size'])->select();
		return array('list'=>$list,'count'=>$count);
	}
}
?>