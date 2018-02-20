<?php
namespace Admin\Model;
use Think\Model;
class ChatModel extends Model {
	protected $tableName = 'chat_record';
	public function showList($user_id,$search,$pages) {
		$where = array();
		$where['sender_id'] = $user_id;
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
			$list[$i]['reciver_name'] = $userModel->where('id='.$list[$i]['reciver_id'])->getField('username');
		}
		return array('list'=>$list,'count'=>$count);
	}
}
?>
