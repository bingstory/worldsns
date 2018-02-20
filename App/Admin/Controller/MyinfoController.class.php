<?php
namespace Admin\Controller;
use Admin\Controller;
class MyinfoController extends BaseController{
    /**
     * 展示管理员个人信息
     */
    public function show()
    {
        $id = session('adminId');       
        $lastTime = session('lastTime');
        $lastIp = session('lastIp');
        $lastArea = $this->getArea($lastIp);
        $admin = M('admin');
        $info = $admin->field('username,tel,email')->where(array('id'=>$id))->find();
        $this->assign('info',$info);
        $this->assign('lastTime',$lastTime);
        $this->assign('lastIp',$lastIp);
        $this->assign('lastArea',$lastArea); 
        $this->display();
    }

    /**
     * 展示修改手机号页面
     */
    public function showModifyTel()
    {
        $id = $id = session('adminId');
        $admin = M('admin');
        $info = $admin->field('tel')->where(array('id'=>$id))->find();
        $this->assign('info',$info); 
        $this->display();
    }

    /**
     * 展示修改密码页面
     */
    public function showModifyPwd()
    {
        $this->display();
    }

    /**
     * 展示邮箱管理页面
     */
    public function showModifyEmail()
    {
        $id = $id = session('adminId');
        $admin = M('admin');
        $info = $admin->field('email')->where(array('id'=>$id))->find();
        $this->assign('info',$info); 
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
        $id = session('adminId');
        $admin = M('admin');
        $info = $admin->where(array('id'=>$id))->find();
        if ($info['pwd'] != md5('being'.$current_pwd)) {
            $data = array('status'=>'error','msg'=>L("current password error"));
            return $this->ajaxReturn($data);
        }
        //更新密码
        $npwd = md5("thxlove".$new_pwd);
        $data['pwd'] = $npwd;
        $data['updated'] = time();
        $condition = array('id'=>$id);
        $result = $admin->where($condition)->save($data);
        if (!$result) {
            $data = array('status'=>'error','msg'=>L('modify failed'));
        }else{
            $data = array('status'=>'success');
        }
        return $this->ajaxReturn($data);
    }

    /**
     * 修改手机号信息
     */
    public function modifyTel()
    {
        $id = session('adminId');
        $admin = M('admin');
        $pwd = I('get.pwd');
        $tel = I('get.tel');
        /**
        * 密码为空验证
        */
        if (!$pwd) {
            $data = array('status'=>'error','msg'=>L("current password can't null"));
            return $this->ajaxReturn($data);
        }

        /**
        * 密码匹配验证
        */
        $condition = array('id'=>$id);
        $info = $admin->where($condition)->find();
        if ($info['pwd'] != md5('being'.$pwd)) {
            $data = array('status'=>'error','msg'=>L("current password error"));
            return $this->ajaxReturn($data);
        }

        /**
        * 手机号为空验证
        */
        if (!$tel) {
            $data = array('status'=>'error','msg'=>L("tel can't null"));
            return $this->ajaxReturn($data);
        }
        if ($tel == $info['tel']) {
            $data = array('status'=>'error','msg'=>L("new tel can't same with old tel"));
            return $this->ajaxReturn($data);
        }
        /**
        * 更新数据库
        */
        $admin->tel = $tel;
        $admin->updated = time();
        $res = $admin->where('id='.$id)->save();
        if (!$res) {
            $data = array('status'=>'error','msg'=>L("opertion failed")); 
        }else{
            $data = array('status'=>'success');
        }
        $this->ajaxReturn($data);
    }

    /**
     * 修改邮箱信息
     */
    public function modifyEmail()
    {
        $id = session('adminId');
        $admin = M('admin');
        $opt = I('get.opt');
        if ($opt == "mod") {
            $pwd = I('get.pwd');
            /**
            * 密码为空验证
            */
            if (!$pwd) {
                $data = array('status'=>'error','msg'=>L("current password can't null"));
                return $this->ajaxReturn($data);
            }

            /**
            * 密码匹配验证
            */
            $condition = array('id'=>$id);
            $info = $admin->where($condition)->find();
            if ($info['pwd'] != md5('being'.$pwd)) {
                $result = false;
             }else{
                $result =  $info['id'];
             }
            if(!$result){
                $data = array('status'=>'error','msg'=>L("current password error"));
                return $this->ajaxError($data);
            }
        }
        $email = I('get.email');

        /**
        * 邮箱为空验证
        */
        if (!$email) {
            $data = array('status'=>'error','msg'=>L("email can't null"));
            return $this->ajaxReturn($data);
        }

        if ($email == $info['email']) {
            $data = array('status'=>'error','msg'=>L("new email can't same with old email"));
            return $this->ajaxReturn($data);
        }
        /**
        * 更新数据库
        */
        $admin->email = $email;
        $admin->updated = time();
        $res = $admin->where('id='.$id)->save();
        if (!$res) {
            $data = array('status'=>'error','msg'=>L("opertion failed")); 
        }else{
            $data = array('status'=>'success');
        }
        $this->ajaxReturn($data);
    }
}