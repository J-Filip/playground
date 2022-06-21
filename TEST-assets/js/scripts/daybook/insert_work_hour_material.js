var wait_message = jquery('#wait-message');
var error_message = jquery('#error-message');
var material_box = jquery('#materials-list');
var material_buttons = jquery('#material_buttons');
var materials_input = jquery('#selected_materials');
var fetched = false;
var fetchMaterialsAjax;

var showWaitLoop = function(){
	wait_message.removeClass('hide');
}

var hideWaitLoop = function(){
	wait_message.addClass('hide');
}

var hideConfirm = function(){
	material_buttons.addClass('hide');
}

var showConfirm = function(){
	material_buttons.removeClass('hide');
}

var showNoMaterialsToShow = function(){
	error_message.removeClass('hide');
}

var hideNoMaterialsToShow = function(){
	error_message.addClass('hide');
}

var fetchMaterials = function(){
	
	material_box.empty();
	showWaitLoop();
	hideConfirm();
	hideNoMaterialsToShow();

	fetchMaterialsAjax = getAjax();

	fetchMaterialsAjax.done(function(result, status, xhr){
		hideWaitLoop();
		fetched = true;
		try {
			var data = JSON.parse(result);

			if (data == false){
				showNoMaterialsToShow();
			}
			else{
				renderMaterials(data);
			}
		}
		catch(err) {
			edFlashAlert('error','Došlo je do pogreške!');
			fetched = false;
		}	
	}).fail(function(){
		hideWaitLoop();
		edFlashAlert('error','Dogodila se greška prilikom dohvata nastavnih materijala');
		fetched = false;
	});
}

var getAjax = function(){
	return jquery.ajax
	('/work_hour_materials/fetch_list/'+jquery('#class_course_id').val(),
	{ 
		method : 'GET'
	});
}

var renderMaterials = function(materials){
	jquery.each(materials, function(i, material){
		material_box.append('<a class="ed-row touch-row inactive edutorium_material" id="'+material.documentID+'">'+  material.documentTitle + '<i class="icon-cancel right"></i>'+'</a>');
	});

	var materials_ms = new edMultiSelect({ elements : $$('.edutorium_material'), input: $$('#selected_materials'), keys: ['id'] });

	showConfirm();
}