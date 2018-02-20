<?php
namespace Index\Controller;
use Index\Controller;
class SpaceController extends BaseController {
	public function profile() {
		$this->display();
	}
	public function ajax_profile() {
		$id = I('post.id');
		$userId = session('userId');
		$l = cookie('think_language');
		if (!$id) {
			$msg = array('status' => 'error');
			$this->ajaxReturn($smg);
		}
        $lang = str_replace('-', '', $l);
        $ext = strtolower($lang);
        $countryfield = 'country_'.$ext;
		$userModel = M('user');
		$spaceUser = $userModel->field("id,username,header,email,mobile,height,weight,sex,year,month,day,".$countryfield." as country,city,worker,sexuality,relationship,income,education,level,gold,mood,language,is_online,is_member,deadline,inner_member")->where('id='.$id)->find();
		if (!$spaceUser) {
			$msg = array('status' => 'error');
			$this->ajaxReturn($smg);
		}
		if (isset($spaceUser['mood'])) {
            $broadcastModel = M('broadcast');
            $spaceUser['mood_content'] = $broadcastModel->where('id='.$spaceUser['mood'])->getField('content');
            if (!$spaceUser['mood_content']) {
                $spaceUser['mood_content'] = '';
            }
        }else{
            $spaceUser['mood_content'] = '';
        }
		if ($id != $userId) {
			$visitorModel = M('visitors');
			$where = array(
					'source_id' => $userId,
					'target_id' => $id 
				);
			$visitorId = $visitorModel->where($where)->getField('id');
			if ($visitorId) {
				$data = array(
						'is_read' => 0,
						'created' => time()
					);
				$res = $visitorModel->where($where)->save($data);
			}else{
				$data = array(
					'source_id' => $userId,
					'target_id' => $id,
					'created' => time()
				);
				$visitorModel->add($data);
			}
		}
		$photoModel = M('photo');
		$photo = $photoModel->field('id,url,album')->where('user_id='.$id)->select();

		$albumModel = M('album');
		$where = "user_id = 0 or user_id = ".$id;
		$album = $albumModel->field('id,name')->where($where)->select();
		$data = array(
				'base' => $spaceUser,
				'photo' => $photo,
				'album' => $album
			);
		$msg = array('status' => 'success','data' => $data);
		$this->ajaxReturn($msg);
	}
	public function album() {
		$this->display();
	}
	public function addAlbum() {
		$name = I('post.name');
		$userId = session('userId');
		$albumModel = M('album');
		$data = array(
				'name' => $name,
				'user_id' => $userId,
				'created' => time()
			);
		$res = $albumModel->add($data);
		if (!$res) {
			$msg = array('status' => 'error');
			return $this->ajaxReturn($msg);
		}
		$album = array('id' => $res,'name' => $name);
		$msg = array('status' => 'success','album' => $album);
		return $this->ajaxReturn($msg);
	}
	public function delAlbum () {
		$albumId = I('post.albumId');
		$userId = session('userId');
		$albumModel = M('album');
		$res = $albumModel->where('id='.$albumId)->delete();
		if (!$res) {
			$msg = array('status' => 'error');
			return $this->ajaxReturn($msg);
		}
		$photoModel = M('photo');
		$where = array(
				'album' => $albumId,
				'user_id' => $userId
			);
		$photoArr = $photoModel->where($where)->select();
		$res = $photoModel->where($where)->delete();
		if ($res && $photoArr) {
			foreach ($photoArr as $item) {
				unlink($item['url']);
			}
		}
		$msg = array('status' => 'success');
		return $this->ajaxReturn($msg);
	}
	public function addPhoto () {
		$albumId = I('post.albumId');
		$userId = session('userId');
		$url = I('post.urls');
		$photoModel = M('photo');
		$data = array(
				'album' => $albumId,
				'url' => $url,
				'user_id' => $userId,
				'created' => time() 
			);
		$res = $photoModel->add($data);
		if (!$res) {
			$msg = array('status' => 'error');
			return $this->ajaxReturn();
		}
		$broadcastModel = M('broadcast');
		$broadData = array(
				'user_id' => $userId,
				'img' => $res,
				'type' => 'photo',
				'created' => time()
			);
		$broadcastId = $broadcastModel->add($broadData);
		$image = new \Think\Image(); 
		$img = $image->open($url);
	    $lastIndex = strrpos($url,'.');
		$fullName40  = substr($url, 0, $lastIndex).'_40'.substr($url, $lastIndex);
		$fullName80  = substr($url, 0, $lastIndex).'_80'.substr($url, $lastIndex);
		$fullName180  = substr($url, 0, $lastIndex).'_180'.substr($url, $lastIndex);
		$image->thumb(180, 180,\Think\Image::IMAGE_THUMB_CENTER)->save($fullName180);
		$image->thumb(80, 80,\Think\Image::IMAGE_THUMB_CENTER)->save($fullName80);
		$image->thumb(40, 40,\Think\Image::IMAGE_THUMB_CENTER)->save($fullName40);
		$photo = array(array('id' => $res,'album' => $albumId,'url' => $url));
		$msg = array('status' => 'success','photo' => $photo);
		return $this->ajaxReturn($msg);
	}
	public function delPhoto () {
		$photoId = I('photoId');
		$photoModel = M('photo');
		$broadcastModel = M('broadcast');
		$broadcast = $broadcastModel->where('img='.$photoId)->find();
		if ($broadcast['type'] != 'photo') {
			$msg = array('status' => 'error');
			return $this->ajaxReturn($msg);
		}
		$res = $photoModel->where('id='.$photoId)->delete();
		if (!$res) {
			$msg = array('status' => 'error');
			return $this->ajaxReturn($msg);
		}
		$broadcastModel->where('img='.$photoId)->delete();
		$msg = array('status' => 'success');
		return $this->ajaxReturn($msg);
	}

	public function about() {
		$this->display();
	}
	public function editAbout() {
		$mood = I('post.about');
		$mood = preg_replace('/qq|QQ|Q|q|faceboook|line|163|126|139|skype|gmail|@|msn|MSN|陌陌|AIM|GTalk|ICQ|FlickIM|Gadu-Gadu|MessengerFX|MySpace|Xfire|wechat|微信.*/','', $mood);
		$data['content'] = preg_replace('/(www\.|WWW\.|\.com|\.COM)/',' ', $mood);
		$userId = session('userId');
		$broadcastModel = M('broadcast');
		$broadData = array(
				'user_id' => $userId,
				'content' => $mood,
				'type' => 'broadcast',
				'created' => time()
			);
		$broadcastId = $broadcastModel->add($broadData);
		$userModel = M('user');
		$data = array(
				'mood' => $broadcastId,
				'updated' => time()
			);

		$res = $userModel->where('id='.$userId)->save($data);
		if (!$res) {
			$msg = array('status' => 'error');
			return $this->ajaxReturn($msg);
		}
		$returnData = array(
				'mood' => $broadcastId,
				'mood_content' => $mood
			);
		$msg = array('status' => 'success','data' =>$returnData);
		$this->ajaxReturn($msg);
	}
	public function editBase() {
		$year = I('post.year');
		$month = I('post.month');
		$day = I('post.day');
		$height = I('post.height');
		$weight = I('post.weight');
		$language = I('post.language');
		$userId = session('userId');
		$userModel = M('user');
		$data = array(
				'year' => $year,
				'month' => $month,
				'day' => $day,
				'height' => $height,
				'weight' => $weight,
				'language' => $language,
			);
		$res = $userModel->where('id='.$userId)->save($data);
		if (!$res) {
			$msg = array('status' => 'error');
		}else{
			$msg = array('status' => 'success');
		}
		$this->ajaxReturn($msg);
	}
	public function editRelation() {
		$sexuality = I('post.sexuality');
		$relationship = I('post.relationship');
		$userId = session('userId');
		$userModel = M('user');
		$data = array(
				'sexuality' => $sexuality,
				'relationship' => $relationship,
				'updated' => time()
			);
		$res = $userModel->where('id='.$userId)->save($data);
		if (!$res) {
			$msg = array('status' => 'error');
		}else{
			$msg = array('status' => 'success');
		}
		$this->ajaxReturn($msg);
	}
	public function editEducation() {
		$education = I('post.education');
		$worker = I('post.work');
		$income = I('post.income');
		$userId = session('userId');
		$userModel = M('user');
		$data = array(
				'education' => $education,
				'worker' => $worker,
				'income' => $income
			);
		$res = $userModel->where('id='.$userId)->save($data);
		if (!$res) {
			$msg = array('status' => 'error');
		}else{
			$msg = array('status' => 'success');
		}
		$this->ajaxReturn($msg); 
	}
	public function editPlace() {
		$country = I('post.country');
		$city = I('post.city');
		$userId = session('userId');
		$userModel = M('user');
		$transController = new TransController();
		$data = array(
				'country_zhcn' => $transController->trans($country,'zh'),
				'country_zhtw' => $transController->trans($country,'cht'),
				'country_de' => $transController->trans($country,'de'),
				'country_enus' => $transController->trans($country,'en'),
				'country_fra' => $transController->trans($country,'fra'),
				'country_it' => $transController->trans($country,'it'),
				'country_ja' => $transController->trans($country,'jp'),
				'country_kokr' => $transController->trans($country,'kor'),
				'country_nl' => $transController->trans($country,'nl'),
				'country_pt' => $transController->trans($country,'pt'),
				'country_ru' => $transController->trans($country,'ru'),
				'country_es' => $transController->trans($country,'spa'),
				'city' => $city
			);
		$res = $userModel->where('id='.$userId)->save($data);
		if (!$res) {
			$msg = array('status' => 'error');
		}else{
			$msg = array('status' => 'success');
		}
		$this->ajaxReturn($msg);
	}
	public function is_online() {
		$userId = session('userId');
		$status = I('post.status');
		$userModel = M('user');
		if ($status) {
			$is_visible = 1;
		}else{
			$is_visible = 0;
		}
		$data = array(
				'is_online' => $status,
				'is_visible' => $is_visible,
				'updated' => time()
			);
		$res = $userModel->where('id='.$userId)->save($data);
		if ($res) {
			$msg = array('status' => 'success');
			$this->ajaxReturn($msg);
		}
	}
}