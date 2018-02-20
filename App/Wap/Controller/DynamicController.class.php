<?php
namespace Wap\Controller;
use Wap\Controller;
class DynamicController extends BaseController {
	public function getList() {
		$index = I('post.index');
		$size = I('post.size');
		$lang = I('post.lang');
		$userId = session('userId');
		$userModel = M('user');
		$mySex = $userModel->where('id='.$userId)->getField('sex');
		if ($mySex == 'male') {
			$sex = 'female';
		}else{
			$sex = 'male';
		}
		$broadcastModel = M('broadcast');
		$where = array(
				'user.sex' => $sex,
				'user.is_service' => 0
			);
		 if ($lang == 'zh') {
            $l = 'zh-cn';
        }elseif ($lang == 'tw') {
            $l = 'zh-tw';
        }elseif ($lang == 'en') {
            $l = 'en-us';
        }elseif ($lang == 'ko') {
            $l == 'ko-kr';
        }elseif ($lang == 'fr') {
            $l == 'fra';
        }else {
            $l == $lang;
        }
        $lang = str_replace('-', '', $l);
        $ext = strtolower($lang);
        $countryfield = 'country_'.$ext;
		$list = $broadcastModel
			->field('broadcast.*,user.id as user_id,user.header as header,user.username as username,user.sex as sex,user.year as year,user.'.$countryfield.' as country')
			//->join('photo on broadcast.img = photo.id')
			->join('user on broadcast.user_id = user.id')
			->where($where)
			->limit($index*$size,$size)
			->order('broadcast.created desc')
			->select();
		$photoModel = M('photo');
		if (!$list) {
			$msg = array('status'=>'error');
			$this->ajaxReturn($msg);
		}
		for ($i = 0 ; $i < count($list) ; $i++) {
			$urls = array();
			if (!empty($list[$i]['img'])) {
				$where = array(
						'id' => $list[$i]['img']
					); 
				$url = $photoModel->where($where)->getField('url');
				$urls[] .= $url;
				$list[$i]['urls'] = $urls;
			}
		}
		$msg = array('status'=>'success','list'=>$list);
		$this->ajaxReturn($msg);
	}
	public function getOneList() {
		$index = I('post.index');
		$size = I('post.size');
		$sid = I('post.sid');
		$broadcastModel = M('broadcast');
		$where = array(
				'user_id' => $sid,
			);
		$list = $broadcastModel
			->field('broadcast.*,user.username as username')
			//->join('photo on broadcast.img = photo.id')
			->join('user on broadcast.user_id = user.id')
			->where($where)
			->limit($index*$size,$size)
			->order('broadcast.created desc')
			->select();
		if (!$list) {
			$msg = array('status' => 'error');
			$this->ajaxReturn($msg);
		}
		$photoModel = M('photo');
		for ($i = 0 ; $i < count($list) ; $i++) {
			$urls = array();
			if (!empty($list[$i]['img'])) {
				$where = array(
						'id' => $list[$i]['img']
					); 
				$url = $photoModel->where($where)->getField('url');
				$urls[] .= $url;
				$list[$i]['urls'] = $urls;
			}
		}
		$msg = array('status' => 'success','data' => $list);
		$this->ajaxReturn($msg);
	}
	public function add() {
		$content = I('post.content');
		$url = I('post.url');
		$userId = session('userId');
		$t = time(); 
		if ($url) {
			$image = new \Think\Image(); 
			$img = $image->open($url);
		    $lastIndex = strrpos($url,'.');
			$fullName40  = substr($url, 0, $lastIndex).'_40'.substr($url, $lastIndex);
			$fullName80  = substr($url, 0, $lastIndex).'_80'.substr($url, $lastIndex);
			$fullName180  = substr($url, 0, $lastIndex).'_180'.substr($url, $lastIndex);
			$image->thumb(180, 180,\Think\Image::IMAGE_THUMB_CENTER)->save($fullName180);
			$image->thumb(80, 80,\Think\Image::IMAGE_THUMB_CENTER)->save($fullName80);
			$image->thumb(40, 40,\Think\Image::IMAGE_THUMB_CENTER)->save($fullName40);
			$photoModel = M('photo');
			$data = array(
					'url' => $url,
					'album' => 1,
					'user_id' => $userId,
					'created' => $t
				);
			$pohotId = $photoModel->add($data);
		}
		$broadcastModel = M('broadcast');
		$data =  array(
				'user_id' => $userId,
				'content' => $content,
				'created' => $t
			);
		if ($pohotId) {
			$data['img'] = $pohotId;
		}
		$res = $broadcastModel->add($data);
		if (!$res) {
			$msg = array('status'=>'error');
			$this->ajaxReturn($msg);
		}
		$photo = array(
			array(
					'id' => $pohotId,
					'url' => $url	
				)
			);
		$msg = array('status'=>'success','photo'=>$photo);
		$this->ajaxReturn($msg);
	}
	public function remove() {
		$dynamicId = I('post.dynamicId');
		$broadcastModel = M('broadcast');
		$where = array(
				'id' => $dynamicId
			);
		$img = $broadcastModel->where($where)->getField('img');
		$res = $broadcastModel->where($where)->delete();
		if (!$res) {
			$msg = array('status' => 'error');
			return $this->ajaxReturn($msg);
		}
		if ($img) {
			$photoModel = M('photo');
			$url = $photoModel->where('id='.$img)->getField('url');
			$photoModel->where('id='.$img)->delete();
			$fullName40  = substr($url, 0, $lastIndex).'_40'.substr($url, $lastIndex);
			$fullName80  = substr($url, 0, $lastIndex).'_80'.substr($url, $lastIndex);
			$fullName180  = substr($url, 0, $lastIndex).'_180'.substr($url, $lastIndex);
			unlink($url);
			unlink($fullName40);
			unlink($fullName80);
			unlink($fullName180);
		}
		$msg = array('status' => 'success');
		return $this->ajaxReturn($msg);
	}
}