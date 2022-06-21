jquery(document).ready(function(){
    var wait_message = jquery('#wait-message');
    var error_message = jquery('#error-message');
    var material_box = jquery('#materials-list');
    var materials_input = jquery('#selected_materials');
    var select = jquery('#work_hour_id');

    var showWaitLoop = function(){
        wait_message.removeClass('hide');
    }
    
    var hideWaitLoop = function(){
        wait_message.addClass('hide');
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
        hideNoMaterialsToShow();
    
        jquery.ajax
        ('/work_hour_materials/fetch_list_by_work_hour/'+select.val(),
        { 
            method : 'GET',
            success: function(result)
            {	
                materials_input.val('');
                material_box.empty();
                try {
                    var data = JSON.parse(result);
                    hideWaitLoop();
                    if (data == false){
                        showNoMaterialsToShow();
                    }
                    else{
                        renderMaterials(data);
                    }	
                }
                catch(err) {
                    hideWaitLoop();
                    edFlashAlert('error','Došlo je do pogreške!');
                }		
            },
            error: function(){
                materials_input.val('');
                material_box.empty();
                hideWaitLoop();
                edFlashAlert('error','Dogodila se greška prilikom dohvata nastavnih materijala');
            }
        });
    }
    
    var renderMaterials = function(materials){
        jquery.each(materials, function(i, material){
            material_box.append('<a class="ed-row touch-row inactive edutorium_material" id="'+material.documentID+'">'+  material.documentTitle + '<i class="icon-cancel right"></i>'+'</a>');
        });

        var materials_ms = new edMultiSelect({ elements : $$('.edutorium_material'), input: $$('#selected_materials'), keys: ['id'] });
    }
    
    select.on('change',function(e){
        materials_input.val('');
        fetchMaterials();
    });

    fetchMaterials();
});




