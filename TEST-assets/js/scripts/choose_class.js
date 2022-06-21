var showLevel = function(level) {
	if(level == 0) {
		$$('.ed-row.touch-row, #class_heading, #virtual_class_heading').show();
		$$('.first-shown, .last-shown').removeClass('first-shown');
		$$('.first-shown, .last-shown').removeClass('last-shown');
		return;
	}

	var vheading = $('virtual_class_heading');
	var cheading = $('class_heading');
	var vlist = $('virtual-class-list');
	var clist = $('class-list');


	if(level === 'v') {
		if(vheading) {
			vheading.show();
		}
		if(cheading) {
			cheading.hide();
		}
		
		vlist.addClass('active');
		clist.removeClass('active');
	} else {
		if(vheading) {
			vheading.hide();
		}
		if(cheading) {
			cheading.show();
		}
		
		if(vlist) {
			vlist.addClass('active');
		}

		clist.removeClass('active');
	}

	$$('.ed-row.touch-row').each(function(item,index) {
		if(item.get('data-class-level') === level) {
			item.addClass('shown');
			item.show();
		} else {
			item.removeClass('shown');
			item.hide();
		}
	});

	var shown = $$('.shown');
		
	shown[0].addClass('first-shown');
	shown[shown.length - 1].addClass('last-shown');
}

var url = window.location.href.split("/"),
is_combined = url[url.length - 1];

if (is_combined == 16270){
	level = 'v';
	showLevel(level)
}

var levels = [];

$$('.ed-row.touch-row').each(function(item,index) {
	levels[index] = item.get('data-class-level');
});
levels.push('0');


$$('.level-selector').each(function(item,index) {
	if(!levels.contains(item.get('data-show-level'))) {
		item.hide();
	}
});

$$('.level-selector').addEvent('click',function(e) {
	var level = this.get('data-show-level');
	showLevel(level);
});



