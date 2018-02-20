<?php
namespace Admin\Model;
use Think\Model;
class PhotoModel extends Model {
	public function showList($user_id,$search,$pages) {
		$where = array();
		$where['user_id'] = $user_id;
		if (isset($search['id']) && is_int($search['id'])) {
			$where['id'] = $search['id'];
		}
		if (isset($search['created_start']) && isset($search['created_end'])){
			$where['created'] = array('BETWEEN',array(strtotime($search['created_start']),strtotime($search['created_end'])+3600*24-1));
		}else if (isset($search['created_start'])) {
			$where['created'] = array('egt',strtotime($search['created_start']));
		}else if (isset($search['created_end'])) {
			$where['created'] = array('elt',strtotime($search['created_end'])+3600*24-1);
		} 
		$count = $this->where($where)->count();
		$list = $this->where($where)->order($pages['sort'].' '.$pages['dir'])->limit(($pages['page']-1)*$pages['size'],$pages['size'])->select();
		$userModel = M('user');
		for ($i = 0 ; $i < count($list) ; $i ++) {
			$list[$i]['reciver_name'] = $userModel->where('id='.$list[$i]['user_id'])->getField('username');
		}
		return array('list'=>$list,'count'=>$count);
	}
}
?>
