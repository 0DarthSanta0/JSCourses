function createCalendar(elem, year, month) {
    let div = document.getElementById('elem');
    let date = new Date(year, month - 1);
    let table = `<table><tr>
        <th>пн</th>
        <th>вт</th>
        <th>ср</th>
        <th>чт</th>
        <th>пт</th>
        <th>сб</th>
        <th>вс</th>
        </tr><tr>`;
    let start = date.getDay();
    if (date.getDay() == 0) {
        start = 7;
    }
    for (let i = 1; i < start; i++) {
        table += `<td></td>`;
    }
    while (date.getMonth() == (month - 1)) {
        table += '<td>' + date.getDate() + '</td>';
        if (date.getDay() % 7 == 0) {
            table += '</tr><tr>';
        }
        date.setDate(date.getDate() + 1);
    }
    if (date.getDay() != 0) {
        for (let i = date.getDay(); i < 7; i++) {
            table += '<td></td>';
        }
    }
    table += '</tr></table>';
    div.innerHTML = table;
}

createCalendar('elem', 2012, 9);