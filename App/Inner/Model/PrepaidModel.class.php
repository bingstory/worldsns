<?php
namespace Inner\Model;
use Think\Model;
class PrepaidModel extends Model {
	protected $tableName = 'order_record';
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
			$where['b.username'] = array('like','%'.$search['username'].'%');
		}
		if (isset($search['created_start']) && isset($search['created_end'])){
			$where['a.created'] = array('BETWEEN',array(strtotime($search['created_start']),strtotime($search['created_end'])+3600*24-1));
		}else if (isset($search['created_start'])) {
			$where['a.created'] = array('egt',strtotime($search['created_start']));
		}else if (isset($search['created_end'])) {
			$where['a.created'] = array('elt',strtotime($search['created_end'])+3600*24-1);
		}
		if (empty($userIds)) {
			return array('list'=>'','count'=>0);
		}
		//var_dump($userIds);
		$where['a.user_id'] = array('in',$userIds);
		$where['a.pay_type'] = array('in',array('ali','paypal'));
		$count = $this->field(array('a.*','b.id'=>'b_id','b.username'=>'b_username'))
			->alias('a')
			->join('user b ON b.id = a.user_id')
			->where($where)
			->count();
		$list = $this->field(array('a.*','b.id'=>'b_id','b.username'=>'b_username'))
			->alias('a')
			->join('user b ON b.id = a.user_id')
			->where($where)->order($pages['sort'].' '.$pages['dir'])->limit(($pages['page']-1)*$pages['size'],$pages['size'])->select();
		$goldModel = M('gold_record');
		for ($i = 0 ; $i < count($list) ; $i ++) {
			if ($list[$i]['pay_status'] == 4  && $list[$i]['goods_type'] == 'recharge' && $list[$i]['record_id'] != null ) {
				$list[$i]['sum'] = $goldModel->where('id='.$list[$i]['record_id'])->getField('sum');
			}else{
				$list[$i]['sum'] = '~';
			}
		} 
		return array('list'=>$list,'count'=>$count);
	}
}
?>