var selectedRow = null;

function onFormSubmit() {
  var formData = readFormData();
  if (selectedRow == null) insertNewRecord(formData);
  else updateRecord(formData);
  resetForm();
}

function readFormData() {
  var formData = {};
  formData.url = document.getElementById('url').value;
  formData.logo = document.getElementById('logo').value;
  return formData;
}

function insertNewRecord(data) {
  let xhr1 = new XMLHttpRequest();

  xhr1.open('POST', 'http://dummy.restapiexample.com/api/v1/create', true);

  // xhr1.getResponseHeader('Content-type', 'application/json');

  xhr1.onload = function () {
    if (this.status === 200) {
      var table = document
        .getElementById('newsList')
        .getElementsByTagName('tbody')[0];
      var newRow = table.insertRow(table.length);
      cell1 = newRow.insertCell(0);
      cell1.innerHTML = `<a href="${data.url}">${data.url}</a>`;
      cell2 = newRow.insertCell(1);
      cell2.innerHTML = `<img src="${data.logo}" style="width:100px;"/>`;
      cell3 = newRow.insertCell(2);
      cell3.innerHTML = `<a onClick="onEdit(this)">Edit</a>
                             <a onClick="onDelete(this)">Delete</a>`;
    } else {
      alert('Error! not inserted');
    }
  };
  xhr1.send(JSON.stringify(data));
}

function resetForm() {
  document.getElementById('url').value = '';
  document.getElementById('logo').value = null;
  selectedRow = null;
}

function onEdit(td) {
  selectedRow = td.parentElement.parentElement;
  document.getElementById('url').value = selectedRow.cells[0].innerHTML;
  document.getElementById('logo').value = selectedRow.cells[1].innerHTML;
}
function updateRecord(formData) {
  let xhr2 = new XMLHttpRequest();

  xhr2.open(
    'PUT',
    `http://dummy.restapiexample.com/api/news?url=${selectedRow.cells[0].innerHTML}`,
    true
  );

  xhr2.onload = function () {
    if (this.status === 200) {
      selectedRow.cells[0].innerHTML = formData.url;
      selectedRow.cells[1].innerHTML = formData.logo;
    } else {
      alert('Error! not updated');
    }
  };
  xhr2.send(JSON.stringify(formData));
}

function onDelete(td) {
  if (confirm('Are you sure to delete this record ?')) {
    row = td.parentElement.parentElement;
    let xhr3 = new XMLHttpRequest();
    xhr3.open(
      'DELETE',
      `http://dummy.restapiexample.com/api/news?url=${row.cells[0].innerHTML}`,
      true
    );
    xhr3.onload = function () {
      if (this.status === 200) {
        document.getElementById('newsList').deleteRow(row.rowIndex);
        resetForm();
      } else {
        alert('Error! not deleted');
      }
    };
    xhr3.send();
  }
}
