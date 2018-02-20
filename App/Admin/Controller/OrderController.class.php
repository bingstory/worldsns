<?php
namespace Admin\Controller;
use Admin\Controller;
/**
*	管理员维护，管理员的增删改查以及赋权功能
*	@author ftian
*/
class OrderController extends BaseController{
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
		$array['url'] = U("Admin/Order/showlist");
		$array['fields'] = array('id'=>'编号','created'=>'创建时间','updated'=>'更新时间');
		//设置分页参数
		$pages['size'] = isset($search['size'])?$search['size']:C('DEFAULT_PAGESIZE');  
		$pages['page'] = isset($search['page'])?$search['page']:1;
		//设置排序参数
		$pages['sort'] = isset($search['sort'])?$search['sort']:'id';
		$pages['dir'] = isset($search['dir'])?$search['dir']:'desc';

		$OrderModel = D('Order');
        $result = $OrderModel->showList($search,$pages);
        $pages['count'] = $result['count'];
        $pages['allPages'] = ceil(intval($pages['count'])/$pages['size']);

        $this->assign('search',$search);
        $this->assign('list',$result['list']);
        $this->assign('num',1);
        $this->assign($array);
        $this->assign($pages);
		$this->display();
		
	}	
}
