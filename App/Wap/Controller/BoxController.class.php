<?php
namespace Wap\Controller;
use Wap\Controller;
class BoxController extends BaseController {
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
	public function getlist() {
		$index = I('post.index');
		$size  = I('post.size');
		$userId = session('userId');
		$usergiftModel = M('user_gift');
		$where = array('reciver_id'=>$userId);
		$list = $usergiftModel->field('user_gift.*,gift.id as gift_id,gift.name as gift_name,gift.img as gift_img')
			->join('gift on user_gift.gift_id = gift.id')
			->where($where)
			->order('gift.created desc')
			->select();
		if (!$list){
			$msg = array('status'=>'error');
			$this->ajaxReturn($msg);
		}else{
			for ($i = 0 ; $i < count($list) ; $i ++) {
				$userModel = M('user');
				$where = array('id' => $list[$i]['sender_id']);
				$sender = $userModel->field('id,username,header,is_online')->where($where)->find();
				$list[$i]['sender'] = $sender;
			}
			$where = array(
                'reciver_id' => $userId
            );
            $data = array('is_read' => 1);
            $usergiftModel->where($where)->save($data);
			$msg = array('status'=>'success','data'=>$list);
			$this->ajaxReturn($msg);
		}
	}
	public function del() {
		$giftId = I('post.giftId');
		$userGiftModel = M('user_gift');
		$res = $userGiftModel->where('id='.$giftId)->delete();
		if (!$res) {
			$msg = array('status'=>'error');
			$this->ajaxReturn($msg);
		}else{
			$msg = array('status'=>'success');
			$this->ajaxReturn($msg);
		}
	}
}
?>