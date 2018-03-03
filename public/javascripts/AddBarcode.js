document.addEventListener("DOMContentLoaded", function(){
  console.log('open management');
  createSelect();
});

async function createSelect() {
  let data = await getInfoForBarcode();
  // var xhr = new XMLHttpRequest();
  // xhr.onreadystatechange = function() {
  //   if (xhr.readyState === 4) {
  //     data = JSON.parse(xhr.response);
  //     console.log(data); //Outputs a DOMString by default
  //
  //   }
  // };
  // xhr.open('GET', `/dbs/info/barcode`, true);
  // xhr.setRequestHeader("Content-type", "application/json");
  // xhr.send();
  console.log('create');
  createSizeSelect();
  createClientSelect(data.clients);
  createBrandSelect(data.brands);
  createColorSelect(data.colors);
}

async function getInfoForBarcode() {
  return new Promise(resolve => {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        data = JSON.parse(xhr.response);
        console.log(data); //Outputs a DOMString by default
        resolve(data);
      }
    };
    xhr.open('GET', `/dbs/info/barcode`, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
  })
}

function createSizeSelect() {
  console.log('createSize');
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

  $('#product_size').selectpicker('refresh');
}

function createClientSelect(clients) {
  console.log('createClient', clients);
  let myDiv = document.getElementById("select_client");

//Create array of options to be added
  let array = clients;

//Create and append select list
  let selectList = document.createElement("select");
  selectList.id = "product_client";
  selectList.className += "selectpicker";
  myDiv.appendChild(selectList);

//Create and append the options
  for (let i = 0; i < array.length; i++) {
    let option = document.createElement("option");
    option.value = array[i].code;
    option.text = array[i].client;
    option.setAttribute("data-subtext", array[i].code);
    option.setAttribute("data-width", "100%");
    selectList.appendChild(option);
  }

  $('#product_client').selectpicker('refresh');
}

function createBrandSelect(brands) {
  console.log('createBrand', brands);
  let myDiv = document.getElementById("select_brand");

//Create array of options to be added
  let array = brands;

//Create and append select list
  let selectList = document.createElement("select");
  selectList.id = "product_brand";
  selectList.className += "selectpicker";
  myDiv.appendChild(selectList);

//Create and append the options
  for (let i = 0; i < array.length; i++) {
    let option = document.createElement("option");
    option.value = array[i].code;
    option.text = array[i].brand;
    option.setAttribute("data-subtext", array[i].code);
    option.setAttribute("data-width", "100%");
    selectList.appendChild(option);
  }

  $('#product_brand').selectpicker('refresh');
}

function createColorSelect(colors) {
  console.log('createColor', colors);
  let myDiv = document.getElementById("select_color");

//Create array of options to be added
  let array = colors;

//Create and append select list
  let selectList = document.createElement("select");
  selectList.id = "product_color";
  selectList.className += "selectpicker";
  myDiv.appendChild(selectList);

//Create and append the options
  for (let i = 0; i < array.length; i++) {
    let option = document.createElement("option");
    option.value = array[i].code;
    option.text = array[i].color;
    option.setAttribute("data-subtext", array[i].code);
    option.setAttribute("data-width", "100%");
    selectList.appendChild(option);
  }

  $('#product_color').selectpicker('refresh');
}

function createBarcodeClicked() {
  
}










function directInputClicked() {
  console.log('직접 입력 실행');

  let code = document.getElementById("product_code").value;
  let color = document.getElementById("product_color").value;
  let size = document.getElementById("product_size").value;

  console.log(code, color, size);

  if (!code) {
    window.alert("항목을 모두 입력해주세요.");
    return;
  }

  const data = {
    code: code,
    color: color,
    size: size
  };

  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      console.log(`result: ${xhr.response}`); //Outputs a DOMString by default
      if (xhr.response === 'true') {
        initProductsInfo();
        window.alert('정상적으로 등록 되었습니다.');
      } else if (xhr.response === 'false') {
        window.alert('현재 등록된 재고가 없습니다.');
      }
    }
  };
  xhr.open('POST', `/dbs/sold`, true);
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
  xhr.open('POST', `/dbs/sold/barcode`, true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(JSON.stringify(data));

  // console.log(`code: ${code}`);
}

function initProductsInfo() {
  document.getElementById("product_code").value = '';
  document.getElementById("product_color").value = '';
  document.getElementById("product_size").value = '';
}

//SELECT * FROM shoes_table as shoes LEFT JOIN sold_table ON shoes.id = sold_table.shoes_id where sold_table.id IS NULL and shoes.size = 130 and shoes.color = "white" limit 0, 1



//SELECT *, count(size) as count FROM (SELECT * FROM shoes_table LEFT JOIN sold_table ON shoes_table.id = sold_table.shoes_id where sold_table.id IS NULL) as sold_shoes join brand_table as brand WHERE sold_shoes.code = brand.code Group by sold_shoes.size, sold_shoes.code order by brand.id