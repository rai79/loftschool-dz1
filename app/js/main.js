var chekIE7Module = (function(){
	var init = function(){
		_ChekIE7();
	};

	var _ChekIE7 = function(){
		if($('.browsehappy').length) alert('Ваш браузер устарел. Пожалуйста обновите его. www.browsehappy.com');
	};

	return{
		init: init
	};

})();

var dz1Module = (function () {

	var init = function () {
		_SetUpListners();
	};

	var _SetUpListners = function () {
		//обработчик нажатия кнопки "добавить проект"
		$('#add-new-project').on('click', _ShowModal);
		$('.add-project').on('click', _ShowModal);
		//обработка кнопочки Сбросить на страничке feedback
		$('#btn-reset').on('click', function(e){
			$(this).parents('form')[0].reset();
			_ClearForm();
		});
		//Закрытие модальной формы добавления проекта
		$('#btn-close-popup').on('click', function(e){
			$(this).parents('form')[0].reset();
			_CloseModal();
		});
		//Валидация 
		$('form').on('submit', _ChekForm);
		//функция проверки input на ввод символов
		$('.input,.textarea').on('keyup', _ChekCurrentInput);
		//проверка изменения содержимого input[type="file"] 
		//если содержимое изменилось то имя файла копируем в фиктивный блок input
		$('.input[type="file"]').on('change', function(e) {
			if(e.target.value.length > 0){
				//проверяем наличие тултипа с ошибкой и если есть то убираем
				$(this).siblings('.errorTooltip').detach();
				//находим фиктивный блок из соседних
				var fakeinput = $(this).siblings('.fakeInputFile');
				//присваеваем фиктивному блоку содержимое (имя файла) реального поля ввода
				var str = e.target.value; //сохраняем содержимое с имнем файла
				//на всякий случай если браузер возвращает какой нибудь путь отрезаем его
				var idx = str.lastIndexOf('\\') + 1; 
				if(str.substr(idx).length > 35) {
					str = str.substr(idx,35) + '...'; //если длина строки больше 40 символов обрезаем ее
				} else {
					str = str.substr(idx);
				}
				fakeinput.text(str);
				//меняем стиль текста (имитация отключения placeholder)
				fakeinput.addClass('FileSelected');
				//убираем обводку при ошибке с фиктивного блока
				fakeinput.removeClass('errorInput');
			} else {
				//еслим нажали отмену и вернуло пустое поле просто возвращаем в исходное состояние
				//меняем стиль текста (возвращаем placeholder)
				fakeinput.removeClass('FileSelected');
				//убираем обводку при ошибке с фиктивного блока
				fakeinput.removeClass('errorInput');
				//текст placeholder
				fakeinput.text('Загрузите изображение');
			}
		});
		//проверка нажатия кнопки ESC и закрытия формы
		$(window).on('keydown', function(e) {
			if((e.keyCode == 27)&&($('#new-project-popup').css('display')!='none')){
				_CloseModal();
			}
		});
		//обработчик кнопки закрытия ошибки сервера
		$('#btn-close-servererr').on('click', _CloseServerError);
		//обработчик кнопки закрытия удачной отправки на сервер
		$('#btn-close-succes').on('click', _CloseServerOk);
	};

	var _ShowModal = function (e) {
		e.preventDefault();
		$('#new-project-popup').show();
	};

	var _CloseModal = function () {
		//чистим форму
		_ClearForm();
		//скрываем форму с ошибкой сервера если она есть
		_CloseServerError();
		//скрываем форму
		$('#new-project-popup').hide();	
	};

	var _ClearForm = function(){
		//возвращаем в исходное состояние фиктивный блок выбора файла
		$('.fakeInputFile').removeClass('FileSelected').text('Загрузите изображение');
		//удаляем тултипы с ошибками
		$('.errorTooltip').detach();
		//удаляем сообщение об ошибке сервера
		$('.errorInput').removeClass('errorInput');
		$('form').removeClass('Error');
		var itemsInput = $('input, textarea');
		$.each(itemsInput, function(index, value){
			$(value).val('');
		});
	};

	var _ChekForm = function(e) {
		e.preventDefault();
		var addForm = $(this);
		var itemsInput = addForm.find('input, textarea');
		var flag = true;
		$.each(itemsInput, function(index, value){
			if( $(value).val().length === 0 ){
				addForm.addClass('Error');
				_ShowTooltip(this);
				flag = false;
			} else {
				addForm.removeClass('Error');
			}
		});

		if(flag){
			_SendForm(addForm);
		}
	};

	var _ChekCurrentInput = function(){
		//удаляем лишние пробелы
		if( $.trim($(this).val()).length > 0){
			//если что то введено то удаляем тултип об ошибке
			_HideTooltip(this);
		};
	};

	var _SendForm = function(addForm){
		var url = addForm.attr('action');
		var formData = new FormData($('form')[0]);
		$.ajax({
		    type: "POST",
		    processData: false,
		    contentType: false,
		    url: url,
		    data: formData 
		    })
		    .done(function( data ) {
		    	var tmpobj = JSON.parse(data);
		    	if(data.status == 'succes'){
		    		_ServerOk();
		    	} else {
		    		//if(typeof(data.textEmail) != 'undefined') {alert(data.textEmail);}
		    		//if(typeof(data.textCaptcha) != 'undefined') {alert(data.textCaptcha);}
		    		//if(typeof(data.textURL) != 'undefined') {$('.server-msg-text').text(data.textURL);}
		    		alert(data.textEmail);
		    		alert(data.textCaptcha);
		    		_ServerError();	
		    	}
		        alert("server done");
		        //alert(data);
		        //var tmpdata = JSON.parse(data);
		        //alert(tmpdata);
		        //alert(tmpdata.text);
		        /*if(data['status'] == 'succes'){
		        	_ServerOk();
		        } else {
		        	_ServerError();	
		        } */
		    })
		    .fail(function() {
		    	$('.server-msg-text').text('Невозможно добавить проект.');
				_ServerError();
			});
/*		$.ajax({
			url: url,
			type: 'POST',
			dataType: 'json',
			data: data
		})
		.done(function() {
			console.log("server done");
			_ServerOk();
		})
		.fail(function() {
			console.log("server error");
			_ServerError();
		});*/
	};

	var _ShowTooltip = function(target){
		//сохраняем текущий инпут
		var currentInput = $(target);
		//описание тултипа с ошибкой
		var showTooltip = "<p class='errorTooltip " + currentInput.data("direction") + "'>" + currentInput.data("info") + "</p>";
		//проверяем есть ли уже сообщение об ошибке или нет 
		//if(elem.find('.errorTooltip').length === 0) {
		if(currentInput.siblings('.errorTooltip').length === 0) {
			//вставляем тултип с ошибкой перед текущим инпутом 
			$(currentInput).before(showTooltip);
			//центрируем тултип на середину инпута
			currentInput.siblings('.errorTooltip').css('top',(currentInput.innerHeight()/2+13)+'px');
			//меняем контур инпута 
			currentInput.addClass('errorInput');
			currentInput.siblings('.fakeInputFile').addClass('errorInput');
		}
	};

	var _HideTooltip = function(target){
		//находим среди соседей текущего инпута тултип с ошибкой и удаляем
		$(target).siblings('.errorTooltip').detach();
		$(target).removeClass('errorInput');
	};

	var _ServerError = function(){
		//чистим форму
		_ClearForm();
		if($('form').hasClass('add-form')){
			//блокируем все кнопочки и инпуты
			$('#btn-add-project').attr('disabled', 'disabled');
			$('input,textarea').attr('disabled', 'disabled');
			//показываем блок ошибки сервера
			$('.errorServerBlock').show();
		}		
	};

	var _CloseServerError = function (){
		//скрываем блок с ошибкой сервера
		$('.errorServerBlock').hide();
		//открываем доступ к кнопочкам и инпутам
		$('#btn-add-project').removeAttr('disabled');
		$('input,textarea').removeAttr('disabled');
	};

	var _ServerOk = function (){
		_ClearForm();
		$('.wrapper-popup').hide();
		$('.wrapper-addSucces').show();
	};

	var _CloseServerOk = function(){
		$('.wrapper-addSucces').hide();
		_CloseModal();
	};

	return{
		init: init
	};
})();

$('input, textarea').placeholder();
chekIE7Module.init();
dz1Module.init();
