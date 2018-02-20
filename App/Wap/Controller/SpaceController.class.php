<?php
namespace Wap\Controller;
use Wap\Controller;
class SpaceController extends BaseController {
	public function profile() {
		$this->display();
	}
	public function ajax_profile() {
		$id = I('post.id');
		$lang = I('post.lang');
		if (!$id) {
			$msg = array('status' => 'error');
			$this->ajaxReturn($smg);
		}
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
            $spaceUser['mood_content'] = 0;
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
		
		$photo = array('id' => $res,'album' => $albumId,'url' => $url);
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
		$msg = array('status' => 'success');
		return $this->ajaxReturn($msg);
	}

	public function getphoto () {
		$this->display();
	}
	public function editInfo() {
		$userId = session('userId');
		$content = I('post.content');
		$field = I('post.field');
		$userModel = M('user');
		$data = array(
				'updated' => time()
			);
		if ($field == 'country') {
			$trans = new TransController();
			$data['country_zhcn'] = $trans->trans($content,'zh');
	        $data['country_zhtw'] = $trans->trans($content,'cht');
	        $data['country_de'] = $trans->trans($content,'de');
	        $data['country_enus'] = $trans->trans($content,'en');
	        $data['country_fra'] = $trans->trans($content,'fra');
	        $data['country_it'] = $trans->trans($content,'it');
	        $data['country_ja'] = $trans->trans($content,'jp');
	        $data['country_kokr'] = $trans->trans($content,'kor');
	        $data['country_nl'] = $trans->trans($content,'nl');
	        $data['country_pt'] = $trans->trans($content,'pt');
	        $data['country_ru'] = $trans->trans($content,'ru');
	        $data['country_es'] = $trans->trans($content,'spa');
	    }elseif ($field == 'mood') {
	    	$content = preg_replace('/qq|QQ|Q|q|faceboook|line|www|WWW|com|COM|163|126|139|skype|gmail|@|msn|MSN|陌陌|AIM|GTalk|ICQ|FlickIM|Gadu-Gadu|MessengerFX|MySpace|Xfire|wechat|微信/','', $content);
			$userId = session('userId');
			$broadcastModel = M('broadcast');
			$broadData = array(
					'user_id' => $userId,
					'content' => $content,
					'type' => 'broadcast',
					'created' => time()
				);
			$broadcastId = $broadcastModel->add($broadData);
			$userModel = M('user');
			$data[$field] = $broadcastId;
		}elseif ($field == 'birthday') {
			$arr = explode('-', $content);
			$data['year'] = $arr[0];
			$data['month'] = $arr[1];
			$data['day'] = $arr[2];
		}else{
			$data[$field] = $content;
		}
		$res = $userModel->where('id='.$userId)->save($data);
		if (!$res) {
			$msg = array('status' => 'error');
		}else{
			$msg = array('status' => 'success');
		}
		$this->ajaxReturn($msg);
	}
	public function editAbout() {
		$mood = I('post.about');
		$userId = session('userId');
		$userModel = M('user');
		$data = array(
				'mood' => $mood,
				'updated' => time()
			);
		$res = $userModel->where('id='.$userId)->save($data);
		if (!$res) {
			$msg = array('status' => 'error');
			return $this->ajaxReturn($msg);
		}
		$msg = array('status' => 'success','data' => $mood);
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
				'relationship' => $relationship
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
		$data = array(
				'country' => $country,
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
}