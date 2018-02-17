document.addEventListener("DOMContentLoaded",function(){
    console.log('open management');
    createSizeSelect();
});

function createSizeSelect() {
  let myDiv = document.getElementById("select_size");

//Create array of options to be added
  let array = [130,140,150,160,170,180,190,200,210,220,225,230,235,240,245,250,255,260,265,270,275,280,285,290,295,300];

//Create and append select list
  let selectList = document.createElement("select");
  selectList.id = "product_size";
  selectList.className += "selectpicker";
  myDiv.appendChild(selectList);

//Create and append the options
  for (let i = 0; i < array.length; i++) {
    let option = document.createElement("option");
    option.value = array[i];
    option.text = array[i];
    option.setAttribute("data-subtext", "Size");
    option.setAttribute("data-width", "100%");
    selectList.appendChild(option);
  }
}

function directInputClicked() {
  console.log('직접 입력 실행');

  let code = document.getElementById("product_code").value;
  let color = document.getElementById("product_color").value;
  let inputPrice = document.getElementById("product_input_price").value;
  let outputPrice = document.getElementById("product_output_price").value;
  let brand = document.getElementById("product_brand").value;
  let size = document.getElementById("product_size").value;
  let client = document.getElementById("product_client").value;

  console.log(code, color, inputPrice, outputPrice, brand, size, client);

  if (!code || !color | !inputPrice || !outputPrice || !brand || !size || !client) {
    window.alert("항목을 모두 입력해주세요.");
    return;
  }

  const data = {
    code: code,
    color: color,
    inputPrice: inputPrice,
    outputPrice: outputPrice,
    brand: brand,
    size: size,
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
  xhr.open('POST', `/dbs/product`, true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(JSON.stringify(data));

  console.log(`code: ${code}`);
}

function inputClickedByBarcode() {
  console.log('직접 입력 실행 by barcode');

  let barcode = document.getElementById("product_barcode").value;

  console.log(barcode);

  if (!barcode) {
    window.alert("바코드를 입력해주세요.");
    return;
  }

  const data = {
    barcode: barcode
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
  xhr.open('POST', `/dbs/product/barcode`, true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(JSON.stringify(data));

  // console.log(`code: ${code}`);
}

function initProductsInfo() {
  document.getElementById("product_code").value = '';
  document.getElementById("product_color").value = '';
  document.getElementById("product_input_price").value = '';
  document.getElementById("product_output_price").value = '';
  document.getElementById("product_brand").value = '';
  document.getElementById("product_size").value = '';
  document.getElementById("product_client").value = '';
}