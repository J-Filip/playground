jquery('.edit-field').edEditMenu('#group1');

$(document.body).addEvent("submit:relay(#search-student-by-oib)", function (e, element) {
	e.preventDefault();
	var data = this.toQueryString().parseQueryString();
	var myRequest = new Request.HTML({
		url: '/hospital_school/search_action',
		method: 'post',
		data: data,
		update: 'modal-content',
		onSuccess: function (t, el, html) {
			repositionModal();
			picker.addEvent('close', function (e) {
				var minDate = new Date($('date_from').get('value'));
				var maxDate = new Date($('date_to').get('value'));
				if (minDate > maxDate) {
					setTimeout(function () {
						edAlert(_('Greška - datum završetka mora biti nakon datuma početka. Molimo odaberite ispravan datum početka ili završetka'));
						$('datepicker_date_to').set('value', '');
						$('date_to').set('value', '');
						$('datepicker_date_from').blur();
						$('datepicker_date_to').blur();
					}, 300);
				}
			});
			new edValidate('#add_hospital_student_action');
		}
	}).send();
});

$(document.body).addEvent("click:relay(#back)", function (e, element) {
	e.preventDefault();
	var myRequest = new Request.HTML({
		url: '/hospital_school/search',
		method: 'get',
		update: 'modal-content',
		onSuccess: function (tree, elements, html) {
			new edValidate('#search-student-by-oib');
			repositionModal();
		}
	}).send();
});

var table = new HtmlTable($('hospital_class'), {
	sortable: true,
	classHeadSort: 'sort-asc',
	classHeadSortRev: 'sort-desc',
	onSort: sorted,
	sortIndex: 2
});

function repositionModal() {
	var modal_top = parseInt($('modal-window').getStyle('top'));
	var win_y = window.getSize().y;
	var modal_y = $('modal-window').getSize().y;
	var top;
	if (win_y < modal_y) {
		top = modal_top;
	} else {
		top = modal_top - Math.floor((win_y - modal_y) / 2);
	}
	if (top > 0) {
		top = '-' + Math.abs(top);
	} else {
		top = Math.abs(top);
	}
	$('modal-window').setStyles({
		'transform': 'translate(0px, ' + top + 'px)'
	});
}

if ($('student-delete')) {
	new edConfirm('#student-delete', _('Želite li ukloniti učenika') + '?');
}