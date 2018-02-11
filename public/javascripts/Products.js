var data = [
  {
    code: '1123'
  }
];

$(document).ready(function() {
  console.log('onReady');


    $('#table').bootstrapTable({
      search: true,
      fixedColumns: true,
      fixedNumber: 2
    });
});

function logout() {
  console.log('logout');
  var xhr = new XMLHttpRequest();
  xhr.open('GET', `/logout`, true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send();
  location.href = '/';
}