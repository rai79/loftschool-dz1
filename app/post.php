<?php
	$userName = $_POST['name'];
	$userEmail = $_POST['email'];
	$userMassage = $_POST['massage'];
	$userCaptcha = $_POST['captcha'];

	$projectName = $_POST['projectName'];
	$projectURL = $_POST['projectURL'];
	$projectDesc = $_POST['projectDesc'];

	$serverStatus = true;

	$data = array();

	if($userName){
		if (!filter_var($userEmail, FILTER_VALIDATE_EMAIL)) {
			$data['status'] = 'error';
			$data['textEmail'] = 'E-mail указан не верно.';
			$serverStatus = false;
		} 
		if (!($userCaptcha == 'E0Ed3r')) {
			$data['status'] = 'error';
			$data['textCaptcha'] = 'Не верно введен код Captcha';
			$serverStatus = false;
		}
		if($serverStatus){
			$data['status'] = 'succes';
			$data['text'] = 'Сообщение отправлено.';
		}
	}

	if($projectName){
		if (!filter_var($projectURL, FILTER_VALIDATE_URL)) {
			$data['statusURL'] = 'error';
			$data['textURL'] = 'ссылка указана не верно!';
			$serverStatus = false;
		} 
		if($serverStatus){
			$data['status'] = 'succes';
			$data['text'] = 'ok';// $_FILES['userfile'];//['name'];//'succes';
			//$data['text'] = 'Проект успешно добавлен.';
			//echo "Файл корректен и был успешно загружен.\n";
			/*$uploaddir = '/uploads/';
			$uploadfile = $uploaddir . basename($_FILES['userfile']['name']);
			if (move_uploaded_file($_FILES['userfile']['tmp_name'], $uploadfile)) {
    			header("Content-Type: application/json");
	echo json_encode($data);
    			echo "Файл корректен и был успешно загружен.\n";
			} else {
				header("Content-Type: application/json");
	echo json_encode($data);
    			echo "Возможная атака с помощью файловой загрузки!\n";
			}*/
		}
	}
//echo $data['status'].'   end status   ' ;
//echo $data['textEmail'].'  end email  ' ;
//echo $data['textCaptcha'].'  end captcha  ' ;
	//header("Content-Type: application/json");
	echo json_encode($data);
?>