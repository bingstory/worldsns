<?php
namespace Admin\Controller;
use Admin\Controller;
/**
*	管理员维护，管理员的增删改查以及赋权功能
*	@author ftian
*/
class PrepaidController extends BaseController{
	/**
	 * 管理员信息列表
	 */
	public function showList()
	{	
		$search = $this->getWhere();
		if (!empty($search['id'])) {
			$search['id'] = intval($search['id']);
		}
		//设置显示项参数
		$array['SelectAll'] = 'yes';
		$array['delSelect'] = 'no';
		$array['disSelect'] = 'no';
		$array['url'] = U("Admin/Prepaid/showlist");
		$array['fields'] = array('id'=>'编号','created'=>'创建时间','updated'=>'更新时间');
		//设置分页参数
		$pages['size'] = isset($search['size'])?$search['size']:C('DEFAULT_PAGESIZE');  
		$pages['page'] = isset($search['page'])?$search['page']:1;
		//设置排序参数
		$pages['sort'] = isset($search['sort'])?$search['sort']:'id';
		$pages['dir'] = isset($search['dir'])?$search['dir']:'desc';

		$Prepaid = D('Prepaid');
        $result = $Prepaid->showList($search,$pages);
        $pages['count'] = $result['count'];
        $pages['allPages'] = ceil(intval($pages['count'])/$pages['size']);

        $this->assign('search',$search);
        $this->assign('list',$result['list']);
        $this->assign('num',1);
        $this->assign($array);
        $this->assign($pages);
		$this->display();
		
	}
	public function refund() {
		$id = I('get.id');
		$amount = I('get.amount');
		$orderModel = M('order_record');
		$orderInfo = $orderModel->where('id='.$id)->find();

		$RefundController = new RefundController(false);
		$resArray = $RefundController->refundReq($orderInfo['correlation_id'],'Partial',$amount,'US','any');
		$refundInfo = strtoupper($resArray["REFUNDINFO"]);
		if ($refundInfo == '') {

		}

		$data = array(
				'pay_status' => 5, 
			);
		$res = $orderModel->where('id='.$id)->save($data);
		if (!$res) {
			$data = array('status'=>'error','msg'=>L("opertion failed"));
			return $this->ajaxReturn(L('operation failure'));
		}else{
			$data = array('status'=>'success','msg'=>L("opertion success"));
			return $this->ajaxReturn ($data);
		}
	}
	public function del()
	{
		$id = I('get.id');
		if (!$id) {
			$data = array('status'=>'error','msg'=>L('illegal submission'));
			return $this->ajaxReturn($data);
		}
		$Prepaid = D('Prepaid');
		$res = $Prepaid->where('id='.$id)->delete();
		if (!$res) {
			$data = array('status'=>'error','msg'=>L("opertion failed"));
			return $this->ajaxReturn(L('operation failure'));
		}else{
			$data = array('status'=>'success','msg'=>L("delete success"));
			return $this->ajaxReturn ($data);
		}
		
	}
}
