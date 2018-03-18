var data = [
  {
    code: '1123'
  }
];
var $button = $('#remove_button');

$(function () {
  $button.click(function () {
    console.log('getSelec', $('#table').bootstrapTable('getSelections'));
    var ids = $.map($('#table').bootstrapTable('getSelections'), function (row) {
      console.log('row.id : ', row.code);
      return row.code;
    });
    $('#table').bootstrapTable('remove', {
      field: 'code',
      values: ids
    });
  });
});

$(document).ready(function() {
  console.log('onReady');

  // $('#table').bootstrapTable('getSelections');

  $('#table').bootstrapTable({
    search: true,
    fixedColumns: true,
    fixedNumber: 2
  });

});