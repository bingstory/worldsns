<?php
namespace Index\Controller;
use Index\Controller;
class GiftBoxController extends BaseController {
	public function index() {
		$userId = session('userId');
		$usergift = M('user_gift');
		$list = $usergift->field(array('user_gift.id'=>'id','user_gift.sender_id'=>'sender_id','user.id'=>'user__id','user_gift.created'=>'created','user.username'=>'username','user.header'=>'header','gift.id'=>'gift__id','gift.name'=>'gift_name','gift.img'=>'img'))
			->join('user ON user.id = user_gift.sender_id')
			->join('gift ON gift.id = user_gift.gift_id')
			->where('user_gift.reciver_id='.$userId)->order('user_gift.created desc')->select();
		$where = array(
				'reciver_id' => $userId
			);
		$data = array('is_read' => 1);
		$usergift->where($where)->save($data);
		$this->assign('list',$list);
		$this->display();
	}
}
?>