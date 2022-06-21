jquery('#toggle-main-course').edSwitch('#main_course');

jquery(document).ready(function(){
    jquery('#ibdp_level_id').bind('change', function () {
	    if (jquery('#ibdp_level_id').val() === "") {	
			jquery('.toggle-container').addClass('hidden');
			jquery('#main_course').val('false');
		} else {
			jquery('.toggle-container').removeClass('hidden');
		}
    });
    jquery('#ibdp_level_id').trigger('change');
});