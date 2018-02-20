<?php
namespace Wap\Controller;
use Wap\Controller;
class VisitorController extends BaseController {
	public function getVisitors() {
        $index = I('post.index');
        $size = I('post.size');
        $userId = session('userId');
        $visitorsModel = M('visitors');
        $list = $visitorsModel->field('visitors.*,user.id as user_id,user.username as username,user.header,user.year as year,user.mood as mood,user.is_online as is_online')
            ->alias('visitors')
            ->join('user as user ON visitors.source_id = user.id')
            ->where('visitors.target_id='.$userId)
            ->order('visitors.created desc')
            ->select();
        if (!$list) {
            $msg = array('status'=>'error');
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
            $where = array(
                'target_id' => $userId
            );
            $data = array('is_read' => 1);
            $visitorsModel->where($where)->save($data);
            $msg = array('status'=>'success','data'=>$list);
            $this->ajaxReturn($msg);
        }
    }
    public function delVisitors() {
        $visitorId = I('post.visitorId');
        $visitorsModel = M('visitors');
        $res = $visitorsModel->where('id='.$visitorId)->delete();
        if (!$res) {
            $msg = array('status'=>'error');
            return $this->ajaxReturn($msg);
        }else{
            $msg = array('status'=>'success');
            return $this->ajaxReturn($msg);
        }
    }
}
?>