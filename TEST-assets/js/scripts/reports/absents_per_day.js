/* Rotate table headers */

window.addEvent('domready', function(){
	var tableHeaders = $$('.log-table th.rotate');
	var rotateClass = 'rotate-90';
	var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

	
	tableHeaders.each(function(th) {

		var inner = new Element('div', {'class': rotateClass, 'html': th.get('html')});
	
		th.empty();

		inner.inject(th);

		var rotate = th.getChildren('.'+rotateClass)[0];
		
		th.setStyles({
			'width': '30px',
			'height': rotate.getDimensions().width,
			'vertical-align': 'bottom',
			'text-align': 'center',
			'padding': '0px',
		});
	});

	if (width > 1700){
		$$('.' + rotateClass).setStyles({
			'line-height': '50px'
		});
	} else if (width > 1400){
		$$('.' + rotateClass).setStyles({
			'line-height': '40px'
		});
	} else {
		$$('.' + rotateClass).setStyles({
			'line-height': '30px'
		});
	}
});