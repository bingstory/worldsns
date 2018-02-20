<?php
namespace Inner\Controller;
use Inner\Controller;
class MyinfoController extends BaseController{
    
    /**
     * 展示修改密码页面
     */
    public function showModifyPwd()
    {
        $this->display();
    }

    /**
     * 修改密码动作
     */
    public function modifyPwd()
    {
        //是否是ajax提交
        if(!IS_AJAX){
            $data = array('status'=>'error','msg'=>L('illegal submission'));
            return $this->ajaxReturn($data);
        }

        //原始密码为空验证
        $current_pwd = I('get.current_pwd');
        if (! $current_pwd) {
            $data = array('status'=>'error','msg'=>L("current password can't null"));
            return $this->ajaxReturn($data);
        }

        //新密码为空验证
        $new_pwd = I('get.new_pwd');
        if (! $new_pwd) {
            $data = array('status'=>'error','msg'=>L("new password can't null"));
            return $this->ajaxReturn($data);
        }

        //确认密码为空验证
        $confirm_pwd = I('get.confirm_pwd');
        if (! $confirm_pwd) {
            $data = array('status'=>'error','msg'=>L("confirm password can't null"));
            return $this->ajaxReturn($data);
        }

        //两次密码相同验证
        if ($new_pwd != $confirm_pwd) {
            $data = array('status'=>'error','msg'=>L("two password does not match"));
            return $this->ajaxReturn($data);
        }

        //验证原始密码是否正确
        $id = session('innerId');
        $EmploeeModel = M('employee');
        $info = $EmploeeModel->where(array('id'=>$id))->find();
        if ($info['pwd'] != md5('tmj'.$current_pwd)) {
            $data = array('status'=>'error','msg'=>L("current password error"));
            return $this->ajaxReturn($data);
        }
        //更新密码
        $npwd = md5("tmj".$new_pwd);
        $data['pwd'] = $npwd;
        $data['updated'] = time();
        $condition = array('id'=>$id);
        $result = $EmploeeModel->where($condition)->save($data);
        if (!$result) {
            $data = array('status'=>'error','msg'=>L('modify failed'));
        }else{
            $data = array('status'=>'success');
        }
        return $this->ajaxReturn($data);
    }
}