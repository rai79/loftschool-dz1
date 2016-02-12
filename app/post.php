<?php

$serverStatus = true;
$data = array();

if(isset($_POST['name'])){
	$data['textEmail'] = 'ok';
	$data['textCaptcha'] = 'ok';
	$data['textMsg'] = 'Сообщение не отправлено.';
	if(isset($_POST['email'],$_POST['captcha'])){
		if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
			$data['status'] = 'error';
			$data['textEmail'] = 'E-mail указан не верно.';
			$serverStatus = false;
		} 
		if (!($_POST['captcha'] == 'E0Ed3r')) {
			$data['status'] = 'error';
			$data['textCaptcha'] = 'Не верно введен код Captcha';
			$serverStatus = false;
		}
		if($serverStatus){
			$data['status'] = 'succes';
			$data['textMsg'] = 'Сообщение отправлено.';
		}

		echo json_encode($data); // вернем полученное в ответе
	    exit;
	} 
}	

if(isset($_POST['projectName'],$_FILES['projectImgFile'])){

	if (!filter_var($_POST['projectURL'], FILTER_VALIDATE_URL)) {
		$data['status'] = 'error';
		$data['textURL'] = 'ссылка указана не верно! (пример http://www.name.com)';
		$data['textFile'] = $_FILES['projectImgFile']['name'].' - не отправлен';
		$serverStatus = false;
	} 
	if($serverStatus){
		$data['status'] = 'succes';
		$data['textURL'] = 'ok';
		$data['textFile'] = $_FILES['projectImgFile']['name'].' - отправлен';
	} 

    echo json_encode($data); // вернем полученное в ответе
    exit;
}
exit;
?>