jquery(document).ready(function() {
	var height = jquery('#content').height();
	var width = parseInt(jquery('#ts-bgr').css('width'));
	var count = jquery('tbody tr:first td.tasks').length;
	var cellWidth = parseInt(width/count);

	//var remainder = width - (count*cellWidth) - 160;

	jquery('tbody').css('height', (height - 130) + 'px');
	jquery('.tasks').css('width', cellWidth + 'px');

	jquery('#ts-table').css('border', 'none');
	jquery('#ts-table').css('visibility', 'visible');
});

//TODO hide scrollbar