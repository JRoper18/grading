var $TABLE;
var $BTN;
var $EXPORT;
function addListeners(){
	$TABLE = $('#table');
	$BTN = $('#export-btn');
	$EXPORT = $('#export');
	$('table').click(function(){
		refreshEverything();
	})
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
		$.ajax({
			'url': 'save',
		  'type': 'POST',
		  'data': JSON.stringify(getJSON()),
			'contentType': "application/json",
			'dataType': 'json'
		});
	});

	$('#import-btn').on('change', {
	}, readFile)
	$(".grade-option").click(function() {
		const newDisplay = $(this)[0].innerHTML;
		const div = $(this).parent().parent().parent();
		div.find(".dropdown-btn").html(newDisplay + ' <span class="caret"></span>');
	})
}
function refreshEverything(){
		jsonData = getJSON();
		$("#gpa-txt").html(getGPA());
		addListeners();
}
function getGPA(){
	let sum = 0;
	for (let i = 0; i < jsonData.length; i++) {
		const letterGrade = jsonData[i]["grade"];
		let base;
		switch(letterGrade){
			case "A":
				base = 4;
				break;
			case "HA":
				base = 5;
				break;
			case "P":
				base = 3;
				break;
			case "PP":
				base = 2;
				break;
		}
		const final = (jsonData[i]["honors"]) ? base+0.5 : base ;
		sum += final;
	}
	const gpa = Math.round(sum / jsonData.length * 100) / 100 //Rounded
	return (gpa == 0) ? "GPA" : gpa ;
}

function getJSON() {
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
	return data;
}
function readFile (evt) {
		var files = evt.target.files;
		var file = files[0];
		var reader = new FileReader();
		reader.onload = function() {
			importFromJSON(this.result);
		}
		reader.readAsText(file)
 }
function getVal(data, whichColumn) {
	switch (whichColumn) {
		case 0: //Course name
			return data.text();
		case 1: //Grade
			return data.find('.dropdown').find('.dropdown-btn').text().trim();
		case 2: //Honors
			return (data.find("input").is(":checked"));
		case 3: //Units Earned
			return parseFloat(data.find(".numValue").text());
		default:
			return "DEFAULT";
	}
}
function rangeRefresh(row, newValue) {
	row.html(newValue);
}
function makeRowString(name, grade, honors, ue){
	return (`
		<td contenteditable="true">${name}</td>
		<td>
			<div class="dropdown">
				<button class="dropdown-btn" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					${grade}
					<span class="caret"></span>
				</button>
				<ul class="dropdown-menu" aria-labelledby="dLabel">
					<li><a class = "grade-option" href="#">PP</a></li>
					<li><a class = "grade-option" href="#">P</a></li>
					<li><a class = "grade-option" href="#">A</a></li>
					<li><a class = "grade-option" href="#">HA</a></li>
				</ul>
			</div>
		</td>
		<td><input type="checkbox" checked="${honors}"/></td>
		<td>
			<div class="numValue">
				${ue}
			</div>
			<input type="range" min="0" max="1.5" step="0.5" value="${ue}" onchange="rangeRefresh($(this).parent().find('.numValue'), this.value);" />
		</td>
		<td>
			<span class="table-remove glyphicon glyphicon-remove"></span>
		</td>
		<td>
			<span class="table-up glyphicon glyphicon-arrow-up"></span>
			<span class="table-down glyphicon glyphicon-arrow-down"></span>
		</td>`);
}
function importFromJSON(jsonStr){
	const json = JSON.parse(jsonStr);
	$("tbody").empty(); //Clear the table
	$("tbody").append("<tr><th>Course Name</th><th>Grade</th><th>Honors</th><th>Units Earned</th><th></th><th></th></tr>"); //Headers
	for(let i = 0; i<json.length; i++){
		$("tbody").append("<tr>" + makeRowString(json[i]["course name"],json[i]["grade"],json[i]["honors"],json[i]["units earned"]) + "</tr>");
	}
	//Add the empty row.
	$("tbody").append("<tr class='hide'>" + makeRowString("Course Name","Grade",true,1) + "</tr>");
	refreshEverything();
}

$(document).ready(function(){
	addListeners();
})
