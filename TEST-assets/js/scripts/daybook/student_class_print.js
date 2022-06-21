var compareHeight = function(a, b) {
	if(a.getSize().y < b.getSize().y) {
		return 1;
	}

	if(a.getSize().y > b.getSize().y) {
		return -1;
	}

	return 0;
};

var compareOrder = function(a,b) {
	if(parseInt(a.get('data-order'), 10) < parseInt(b.get('data-order'), 10)) {
		return -1;
	}

	if(parseInt(a.get('data-order'), 10) > parseInt(b.get('data-order'), 10)) {
		return 1;
	}

	return 0;
};

var arrangeCourses = function(compact) {
	$$('.page').each(function(page, index) {
		if(page.get('id') === 'report-cover') {
			return;
		}

		var courses = page.getFirst('div');
		var tables = courses.getElements('table.grades');
		if(compact) {
			tables.sort(compareHeight);
		} else {
			tables.sort(compareOrder);
		}

		tables.dispose();

		var left = new Element('div', {
			'class': 'v-top left t-left',
			styles: {
				width: '49%'
			}
		});
		var right = new Element('div', {
			'class': 'v-top right t-right',
			styles: {
				width: '49%'
			}
		});
		right.inject(courses, 'top');
		left.inject(courses, 'top');

		for(var i = 0; i < tables.length; i++) {
			if(i%2 === 0) {
				tables[i].inject(left);
			} else {
				tables[i].addClass('t-left');
				tables[i].inject(right);
			}
		}
	});
};

arrangeCourses(false);

