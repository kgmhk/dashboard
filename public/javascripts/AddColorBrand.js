$(document).ready(function() {
  console.log('onReady');


  $('#color_table').bootstrapTable({
    search: true
  });

  $('#brand_table').bootstrapTable({
    search: true
  });
});

document.addEventListener("DOMContentLoaded",function(){
  console.log('open management');
});

function addColorClicked() {
  console.log('직접 입력 실행');

  let color = document.getElementById("product_color").value;

  console.log(`color: ${color}`);

  if (!color) {
    window.alert("색상을 입력해주세요.");
    return;
  }

  const data = {
    color: color
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
  xhr.open('POST', `/dbs/color`, true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(JSON.stringify(data));

}

function addBrandClicked() {
  console.log('직접 입력 실행');

  let brand = document.getElementById("product_brand").value;

  console.log(`brand: ${brand}`);

  if (!brand) {
    window.alert("브랜드명을 입력해주세요.");
    return;
  }

  const data = {
    brand: brand
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
  xhr.open('POST', `/dbs/brand`, true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(JSON.stringify(data));

}

function addClientClicked() {
  console.log('직접 입력 실행');

  let client = document.getElementById("product_client").value;

  console.log(`client: ${client}`);

  if (!client) {
    window.alert("거래처명을 입력해주세요.");
    return;
  }

  const data = {
    client: client
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
  xhr.open('POST', `/dbs/client`, true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(JSON.stringify(data));

}

function initProductsInfo() {
  document.getElementById("product_brand").value = '';
  document.getElementById("product_color").value = '';
}
