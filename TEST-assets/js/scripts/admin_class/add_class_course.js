var professions_ms = new edMultiSelect({ elements: $$('.ed-row.touch-row'), input: $$('#selected_professions'), keys: ['id', 'name'] });
professions_ms.submit_fields();

jquery('#toggle-insert-all').edSwitch('#insert_all');
jquery('#toggle-class-course-at-home').edSwitch('#class_course_at_home');
jquery('#toggle-individual-course').edSwitch('#individual_course');
jquery('#toggle-core-course').edSwitch('#core_course');


$('course_id').addEvent('change', function(){
	var mzos = this.getSelected().getProperty('data-mzos');
	if(mzos != ''){
		$('parent_class_course').addClass('hide');
	}else{
		$('parent_class_course').removeClass('hide');
	}

	if($$('.core_course').length>0) {
		if(this.getSelected()[0].getProperty('text').indexOf('temeljni predmet') > -1) {
			$('core_true').fireEvent('click');
		} else {
			$('core_false').fireEvent('click');
		}
	}

});
