var $TABLE = $('#table');
var $BTN = $('#export-btn');
var $EXPORT = $('#export');

$('.table-add').click(function() {
	var $clone = $TABLE.find('tr.hide').clone(true).removeClass('hide table-line');
	$TABLE.find('table').append($clone);
});

$('.table-remove').click(function() {
	$(this).parents('tr').detach();
});

$('.table-up').click(function() {
	var $row = $(this).parents('tr');
	if ($row.index() === 1) return; // Don't go above the header
	$row.prev().before($row.get(0));
});

$('.table-down').click(function() {
	var $row = $(this).parents('tr');
	$row.next().after($row.get(0));
});

// A few jQuery helpers for exporting only
jQuery.fn.pop = [].pop;
jQuery.fn.shift = [].shift;

$BTN.click(function() {
	var $rows = $TABLE.find('tr:not(:hidden)');
	var headers = [];
	var data = [];

	// Get the headers (add special header logic here)
	$($rows.shift()).find('th:not(:empty)').each(function() {
		headers.push($(this).text().toLowerCase());
	});

	// Turn all existing rows into a loopable array
	$rows.each(function() {
		var $td = $(this).find('td');
		var h = {};

		// Use the headers from earlier to name our hash keys
		headers.forEach(function(header, i) {
			const currentData = $td.eq(i);
			h[header] = getVal(currentData, i);
		});

		data.push(h);
	});

	// Output the result
	$EXPORT.text(JSON.stringify(data));
});

function getVal(data, whichColumn) {
	switch (whichColumn) {
		case 0: //Course name
			return data.text();
		case 1: //Grade
			return data.find('.dropdown').find('.dropdown-btn').text().trim();
		case 2: //Honors
			return data.find("input").attr("checked") == "checked";
		case 3: //Units Earned
			return parseFloat(data.find(".numValue").text());
		default:
			return "DEFAULT";
	}
}
$(".grade-option").click(function() {
	const newDisplay = $(this)[0].innerHTML;
	const div = $(this).parent().parent().parent();
	div.find(".dropdown-btn").html(newDisplay + ' <span class="caret"></span>');
})

function rangeRefresh(row, newValue) {
	row.html(newValue);
}
