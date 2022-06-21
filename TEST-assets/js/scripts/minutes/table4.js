/* Rotate table headers */
window.addEvent('domready', function(){
	var tableHeaders = $$('#content_table th.rotate');
	var rotateClass = 'rotate-90';

	tableHeaders.each(function(th) {
		// wrapInner implementation
		var inner = new Element('div', {'class': rotateClass, 'html': th.get('html')});
		th.empty();
		inner.inject(th);

		var rotate = th.getChildren('.'+rotateClass)[0];

		th.setStyles({
			'width': rotate.getDimensions().height,
			'height': rotate.getDimensions().width,
			'vertical-align': 'bottom',
			'text-align': 'left',
			'padding': '5px'
		});
	});

	$$('.' + rotateClass).setStyles({
		'padding': 0
	});
});
