<?php
namespace Wap\Controller;
use Wap\Controller;
class FavorController extends BaseController {
	public function favor() {
        $id = I('post.favorId');
        $userId = session('userId');
        if (!$id) {
            $msg = array('status'=>'error');
            return $this->ajaxReturn($msg);
        }
        if($id == $userId) {
            return false;
        }
        $favorModel = M('user_favor');
        $where = array(
                'source_id'=>$userId,
                'target_id'=>$id
            );
        $favorId =  $favorModel->where($where)->getField('id');
        if ($favorId) {
            $msg = array('status'=>'success');
            return $this->ajaxReturn($msg);
        }
        $data = array('source_id'=>$userId,'target_id'=>$id,'created'=>time());
        $res = $favorModel->add($data);
        if (!$res) {
            $msg = array('status'=>'error');
            return $this->ajaxReturn($msg); 
        }
        $msg = array('status'=>'success');
        return $this->ajaxReturn($msg);
    }
     public function getFavor() {
        $index = I('post.index');
        $pageSize = I('post.pageSize');
        $userId = session('userId');
        $favorModel = M('user_favor');
        $list = $favorModel->field('user_favor.*,user.id as user_id,user.username as username,user.header as header,user.year as year,user.mood as mood,user.is_online as is_online')
                ->join('user on user_favor.target_id = user.id')
                ->where('user_favor.source_id='.$userId)
                ->order('user_favor.created desc')
                ->select();
        if (!$list) {
            $msg = array('status'=>'error');
            return $this->ajaxReturn($msg);
        }else{
            /*$where = array(
                'source_id' => $userId
            );
            $data = array('is_read' => 1);
            $favorModel->where($where)->save($data);*/
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
            $msg = array('status'=>'success','data'=>$list);
            return $this->ajaxReturn($msg);
        }
    }
    public function delFavor() {
        $favorId = I('post.favorId');
        $favorModel = M('user_favor');
        $res = $favorModel->where('id='.$favorId)->delete();
        if (!$res) {
            $msg = array('status'=>'error');
            return $this->ajaxReturn($msg);
        }else{
            $msg = array('status'=>'success');
            return $this->ajaxReturn($msg);
        }

    }
}