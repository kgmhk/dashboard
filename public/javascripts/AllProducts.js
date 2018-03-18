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
      console.log('row.id : ', row.id);
      removeInventory(row.id)
      return row.id;
    });
    $('#table').bootstrapTable('remove', {
      field: 'id',
      values: ids
    });
  });
});

$(document).ready(function() {
  console.log('onReady');

  // $('#table').bootstrapTable('getSelections');

  $('#table').bootstrapTable({
    search: true
    // fixedColumns: true,
    // fixedNumber: 2
  });

});

function removeInventory(id) {
  console.log('상품 삭제 - ', id);

  const data = {
    id: id
  };

  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      const res = JSON.parse(xhr.response);
      console.log(`result: ${JSON.stringify(res)}`); //Outputs a DOMString by default
      if (res.result === true) {
        initProductsInfo();
        window.alert(res.msg);
      } else if (res.result === false) {
        window.alert(res.msg);
      }
    }
  };
  xhr.open('POST', `/dbs/products/delete`, true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(JSON.stringify(data));

  // console.log(`code: ${code}`);
}