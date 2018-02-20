<?php
namespace Wap\Controller;
use Wap\Controller;
class LikeController extends BaseController {
	public function like() {
		$id = I('post.likeId');
        $userId = session('userId');
        if (!$id) {
            $msg = array('status'=>'error');
            return $this->ajaxReturn($msg);
        }
        if($id == $userId) {
            return false;
        }
        $likeModel = M('user_like');
        $where = "(source_id = $userId AND target_id = $id) OR (source_id = $id AND target_id = $userId)"; 
        $res = $likeModel->where($where)->find();
        if (!$res) {
            $data = array('source_id'=>$userId,'target_id'=>$id,'created'=>time());
            $res = $likeModel->add($data);
            if (!$res) {
                $msg = array('status'=>'error');
                return $this->ajaxReturn($msg); 
            }
            $msg = array('status'=>'success');
            return $this->ajaxReturn($msg);
        }else{
            $t = time();
            $where = array(
                    'id' =>  $res['id']
                );
            $data = array('updated' => $t);
            if ($res['source_id'] == $id) {
                $data['is_match'] = 1;
            }
            $res = $likeModel->where($where)->save($data);
            if (!$res) {
                $msg = array('status'=>'error');
                return $this->ajaxReturn($msg);
            }else{
                $msg = array('status'=>'success');
                return $this->ajaxReturn($msg);
            }
        } 
	}
    public function getLike() {
        $userId = session('userId');
        $type = I('post.type');
        $index = I('post.index');
        $size = I('post.size');
        $userLikeModel = M('user_like');
        if ($type == 'initiative') {
            $initiativeWhere = array(
                    'user_like.source_id' => $userId
                );
            $passiveWhere = array(
                    'user_like.target_id' => $userId,
                    'user_like.is_match' => 1
                );
            $initiativelist = $userLikeModel->field('user_like.*,user.id as user_id,user.header as header,user.username as username,user.mood as mood,user.year as year,user.is_online as is_online')
                ->join('user on user_like.target_id = user.id')
                ->where($initiativeWhere)->select();
            $passivelist = $userLikeModel->field('user_like.*,user.id as user_id,user.header as header,user.username as username,user.mood as mood,user.year as year,user.is_online as is_online')
                ->join('user on user_like.source_id = user.id')
                ->where($passiveWhere)->select();
        }
        if ($type == 'passive') {
            $initiativeWhere = array(
                    'user_like.target_id' => $userId
                );
            $passiveWhere = array(
                    'user_like.source_id' => $userId,
                    'user_like.is_match' => 1
                );
            $initiativelist = $userLikeModel->field('user_like.*,user.id as user_id,user.header as header,user.username as username,user.mood as mood,user.year as year,user.is_online as is_online')
                ->join('user on user_like.source_id = user.id')
                ->where($initiativeWhere)->select();
            $passivelist = $userLikeModel->field('user_like.*,user.id as user_id,user.header as header,user.username as username,user.mood as mood,user.year as year,user.is_online as is_online')
                ->join('user on user_like.target_id = user.id')
                ->where($passiveWhere)->select();
            $res = $userLikeModel->where($initiativeWhere)->save(array('is_read' => 1));
            $res = $userLikeModel->where($passiveWhere)->save(array('is_read' => 1));
        }
        if ($type == 'match') {
            $initiativeWhere = array(
                    'user_like.source_id' => $userId,
                    'user_like.is_match' => 1   
                );
            $passiveWhere = array(
                    'target_id' => $userId,
                    'user_like.is_match' => 1 
                );
            $initiativelist = $userLikeModel->field('user_like.*,user.id as user_id,user.header as header,user.username as username,user.mood as mood,user.year as year,user.is_online as is_online')
                ->join('user on user_like.target_id = user.id')
                ->where($initiativeWhere)->select();
            $passivelist = $userLikeModel->field('user_like.*,user.id as user_id,user.header as header,user.username as username,user.mood as mood,user.year as year,user.is_online as is_online')
                ->join('user on user_like.source_id = user.id')
                ->where($passiveWhere)->select();
            $res = $userLikeModel->where($initiativeWhere)->save(array('is_read' => 1));
            $res = $userLikeModel->where($passiveWhere)->save(array('is_read' => 1));
        }
        if (!$initiativelist && !$passivelist) {
            $list = array();
        }elseif (!$initiativelist){
            $list = $passivelist;
        }elseif (!$passivelist) {
            $list = $initiativelist;
        }else{
            $list = array_merge($initiativelist,$passivelist);
        }
        if (!$list) {
            $msg = array('status' => 'error');
            $this->ajaxReturn($msg);
        }else{
            $broadcastModel = M('broadcast');
            for ($i = 0 ; $i < count($list) ; $i ++) {
                if (isset($list[$i]['mood'])) {
                    $list[$i]['mood'] = $broadcastModel->where('id='.$list[$i]['mood'])->getField('content');
                    if (!$list[$i]['mood']) {
                        $list[$i]['mood'] = '...';
                    }
                }else{
                    $list[$i]['mood'] = '...';
                }
            }
            $msg = array('status' => 'success','data'=>$list);
            $this->ajaxReturn($msg);
        }
    }
    public function delLike() {
        $likeId = I('post.likeId');
        $userId = session('userId');
        $type = I('post.type');

        $userLikeModel = M('user_like');
        $where = array(
                'id' => $likeId
            );
        $item = $userLikeModel->where($where)->find();
        if (!$item) {
            $msg = array('status' => 'error');
            $this->ajaxReturn($msg);
        }else{
            if ($type == 'match') {
                $res = $userLikeModel->where($where)->delete();
            }
            elseif ($type == 'initiative'){
                if ($item['source_id'] == $userId && !$item['is_match']) {
                    $res = $userLikeModel->where($where)->delete();
                }elseif ($item['source_id'] == $userId && $item['is_match']) {
                    $data = array(
                            'source_id' => $item['target_id'],
                            'target_id' => $userId,
                            'is_match' => 0
                        );
                    $res = $userLikeModel->where($where)->save($data);
                }elseif ($item['target_id'] == $userId && $item['is_match']){
                    $data = array(
                            'is_match' => 0
                        );
                    $res = $userLikeModel->where($where)->save($data);
                }
            }elseif ($type == 'passive') {
                if ($item['target_id'] == $userId && !$item['is_match']) {
                    $res = $userLikeModel->where($where)->delete();
                }elseif ($item['target_id'] == $userId && $item['is_match']) {
                    $data = array(
                            'source_id' => $userId,
                            'target_id' => $item['source_id'],
                            'is_match' => 0
                        );
                    $res = $userLikeModel->where($where)->save($data);
                }elseif ($item['source_id'] == $userId && $item['is_match']) {
                    $data = array(
                            'is_match' => 0
                        );
                    $res = $userLikeModel->where($where)->save($data);
                }

            }
            if (!$res) {
                $msg = array('status' => 'error');
            }else{
                $msg = array('status' => 'success');
            }
            $this->ajaxReturn($msg);
        }
    }
}
?>