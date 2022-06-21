var wait = new edWait();

$$('#schoolyear_id').addEvent('change', function(ev) {
	wait.show();

	var scid = $('schoolyear_id').get('value');
	window.location = '/reports/teacher_workload/' + scid;
});

var content_size = $('container_div') ? $('container_div').getSize() : 0;
var table_size = $('content_table') ? $('content_table').getSize() : 0;

if(content_size.x < table_size.x) {
	$$('.class-course').each(function(item, index) {
		var itemContent = item.get('html').trim();

		if(itemContent.length > 3) {
			var sc = new Element('i', {'class': 'icon-info tipper', 'data-tooltip': item.innerHTML });

			item.empty();
			item.adopt(sc);
		}
	});

	new edTips('.tipper');
}
