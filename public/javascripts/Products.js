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