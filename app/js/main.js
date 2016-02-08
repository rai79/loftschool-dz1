var dz1Module = (function () {

	var init = function () {
		_SetUpListners();
	};

	var _SetUpListners = function () {
		//обработчик нажатия кнопки "добавить проект"
		$('#add-new-project').on('click', _ShowModal);
		$('.add-project').on('click', _ShowModal);
		//Закрытие модальной формы добавления проекта
		$('#btn-close-popup').on('click', function(e){
			e.preventDefault();
			_CloseModal();
		});
		//Валидация 
		$('form').on('submit', _ChekForm);
		//функция проверки input на ввод символов
		$('.input,.textarea').on('keyup', _ChekCurrentInput);
		//проверка изменения содержимого input[type="file"] 
		//если содержимое изменилось то имя файла копируем в фиктивный блок input
		$('.input[type="file"]').on('change', function(e) {
			if($(this).val().length > 0){
				//проверяем наличие тултипа с ошибкой и если есть то убираем
				$(this).siblings('.errorTooltip').detach();
				//находим фиктивный блок из соседних
				var fakeinput = $(this).siblings('.fakeInputFile');
				//присваеваем фиктивному блоку содержимое (имя файла) реального поля ввода
				var str = $(this).val(); //сохраняем содержимое с имнем файла
				//на всякий случай если браузер возвращает какой нибудь путь отрезаем его
				var idx = str.lastIndexOf('\\') + 1; 
				if(str.substr(idx).length > 35) {
					str = str.substr(idx,35) + '...'; //если длина строки больше 40 символов обрезаем ее
				} else {
					str = str.substr(idx);
				}
				fakeinput.children().text(str);
				//меняем стиль текста (имитация отключения placeholder)
				fakeinput.addClass('FileSelected');
				//убираем обводку при ошибке с фиктивного блока
				fakeinput.removeClass('errorInput');
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
		//скрываем форму
		$('#new-project-popup').hide();	
	};

	var _ClearForm = function(){
		$('.add-form')[0].reset();
		//возвращаем в исходное состояние фиктивный блок выбора файла
		$('.fakeInputFile').removeClass('FileSelected').children().text('Загрузите изображение');
		//удаляем тултипы с ошибками
		$('.errorTooltip').detach();
		//удаляем сообщение об ошибке сервера
		$('.errorInput').removeClass('errorInput');
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
				addForm.removeClass('Error')
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
		var data = addForm.serializeArray();
		$.ajax({
			url: url,
			type: 'POST',
			dataType: 'json',
			data: data
		})
		.done(function() {
			_ServerOk();
		})
		.fail(function() {
			_ServerError();
		});
	};

	var _ShowTooltip = function(target){
		//сохраняем текущий инпут
		var currentInput = $(target);
		//описание тултипа с ошибкой
		var showTooltip = "<p class='errorTooltip " + currentInput.data("direction") + "'>" + currentInput.data("info") + "</p>";
		//находим родитея для инпута
		var elem = currentInput.parent('fieldset');
		//проверяем есть ли уже сообщение об ошибке или нет 
		if(elem.find('.errorTooltip').length === 0) {
			//вставляем тултип с ошибкой перед текущим инпутом 
			$(currentInput).before(showTooltip);
			//центрируем тултип на середину инпута
			elem.find('.errorTooltip').css('top',(currentInput.innerHeight()/2+13)+'px');
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
		_ClearForm();
		$('#btn-add-project').attr('disabled', 'disabled');
		$('input,textarea').attr('disabled', 'disabled');
		$('.errorServerBlock').show();
	};

	var _CloseServerError = function (){
		$('.errorServerBlock').hide();
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

dz1Module.init();
