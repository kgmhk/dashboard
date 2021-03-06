document.addEventListener('DOMContentLoaded', function(){
  console.log('open management');
  createSelect();
});

const LOG = 'ADD_BARCODE';

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
  // xhr.setRequestHeader('Content-type', 'application/json');
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
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send();
  })
}

function createSizeSelect() {
  console.log('createSize');
  let myDiv = document.getElementById('select_size');

//Create array of options to be added
  let array = [130,140,150,160,170,180,190,200,210,220,225,230,235,240,245,250,255,260,265,270,275,280,285,290,295,300];


//Create and append select list
  let selectList = document.createElement('select');
  selectList.id = 'product_size';
  selectList.className += 'selectpicker';

  myDiv.appendChild(selectList);

//Create and append the options
  for (let i = 0; i < array.length; i++) {
    let option = document.createElement('option');
    option.value = array[i];
    option.text = array[i];
    option.setAttribute('data-subtext', 'Size');
    option.setAttribute('data-width', '100%');
    selectList.appendChild(option);
  }

  $('#product_size').selectpicker('refresh');
}

function createClientSelect(clients) {
  console.log('createClient', clients);
  let myDiv = document.getElementById('select_client');

//Create array of options to be added
  let array = clients;

//Create and append select list
  let selectList = document.createElement('select');
  selectList.id = 'product_client';
  selectList.className += 'selectpicker';
  myDiv.appendChild(selectList);

//Create and append the options
  for (let i = 0; i < array.length; i++) {
    let option = document.createElement('option');
    option.value = array[i].code;
    option.text = array[i].client;
    option.setAttribute('data-subtext', array[i].code);
    option.setAttribute('data-width', '100%');
    selectList.appendChild(option);
  }

  $('#product_client').selectpicker('refresh');
}

function createBrandSelect(brands) {
  console.log('createBrand', brands);
  let myDiv = document.getElementById('select_brand');

//Create array of options to be added
  let array = brands;

//Create and append select list
  let selectList = document.createElement('select');
  selectList.id = 'product_brand';
  selectList.className += 'selectpicker';
  myDiv.appendChild(selectList);

//Create and append the options
  for (let i = 0; i < array.length; i++) {
    let option = document.createElement('option');
    option.value = array[i].code;
    option.text = array[i].brand;
    option.setAttribute('data-subtext', array[i].code);
    option.setAttribute('data-width', '100%');
    selectList.appendChild(option);
  }

  $('#product_brand').selectpicker('refresh');
}

function createColorSelect(colors) {
  console.log('createColor', colors);
  let myDiv = document.getElementById('select_color');

//Create array of options to be added
  let array = colors;

//Create and append select list
  let selectList = document.createElement('select');
  selectList.id = 'product_color';
  selectList.className += 'selectpicker';
  myDiv.appendChild(selectList);

//Create and append the options
  for (let i = 0; i < array.length; i++) {
    let option = document.createElement('option');
    option.value = array[i].code;
    option.text = array[i].color;
    option.setAttribute('data-subtext', array[i].code);
    option.setAttribute('data-width', '100%');
    selectList.appendChild(option);
  }

  $('#product_color').selectpicker('refresh');
}

function createBarcodeClicked() {
  console.log(LOG, 'createBarcode Clicked');

  // const elem = document.getElementById;
  // console.log(LOG, 'elemclient ', $('#product_client'));
  const clientCode = document.getElementById('product_client').value;
  const brandCode = document.getElementById('product_brand').value;
  const designCode = document.getElementById('product_design').value;
  const colorCode = document.getElementById('product_color').value;
  const sizeCode = document.getElementById('product_size').value;
  const inputCode = document.getElementById('product_input').value;
  const outputCode = document.getElementById('product_output').value;

  console.log(LOG, `${clientCode}, ${brandCode}, ${designCode}, ${colorCode}, ${sizeCode}`);

  const barcode = `${pad(clientCode, 2)}${pad(brandCode, 2)}${pad(designCode, 3)}${pad(colorCode, 2)}&${sizeCode}&${inputCode}&${outputCode}`;

  if (!clientCode || !brandCode || !designCode || !colorCode || !sizeCode || !inputCode || !outputCode) {
    window.alert('모든 항목을 입력해주세요.');
    return;
  }


  const passphrase = 'barcode';

  var encrypted = CryptoJS.AES.encrypt(barcode, passphrase).toString();
  var decrypted = CryptoJS.AES.decrypt(encrypted, passphrase).toString(CryptoJS.enc.Utf8);

  console.log('encrypted : ', encrypted);
  console.log('decrypted : ', decrypted);


  document.getElementById('product_barcode').value = barcode;
}

function pad(n, width) {
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}


function initCreatedBarcode() {
  console.log('생성된 바코드로 재고 입력');

  const barcode = document.getElementById('product_barcode').value;

  console.log(barcode);

  if (!barcode) {
    window.alert('바코드를 입력해주세요.');
    return;
  }

  const data = {
    barcode: barcode
  };

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      const res = JSON.parse(xhr.response);
      console.log(`result: ${JSON.stringify(res)}`); //Outputs a DOMString by default
      if (res.result === true) {
        // initProductsInfo();
        window.alert(res.msg);
      } else if (res.result === false) {
        window.alert(res.msg);
      }
    }
  };
  xhr.open('POST', '/dbs/product/barcode', true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(data));

  document.getElementById('product_barcode').value = '';
}

// function directInputClicked() {
//   console.log('직접 입력 실행');
//
//   let code = document.getElementById('product_code').value;
//   let color = document.getElementById('product_color').value;
//   let size = document.getElementById('product_size').value;
//
//   console.log(code, color, size);
//
//   if (!code) {
//     window.alert('항목을 모두 입력해주세요.');
//     return;
//   }
//
//   const data = {
//     code: code,
//     color: color,
//     size: size
//   };
//
//   let xhr = new XMLHttpRequest();
//   xhr.onreadystatechange = function() {
//     if (xhr.readyState === 4) {
//       console.log(`result: ${xhr.response}`); //Outputs a DOMString by default
//       if (xhr.response === 'true') {
//         initProductsInfo();
//         window.alert('정상적으로 등록 되었습니다.');
//       } else if (xhr.response === 'false') {
//         window.alert('현재 등록된 재고가 없습니다.');
//       }
//     }
//   };
//   xhr.open('POST', `/dbs/sold`, true);
//   xhr.setRequestHeader('Content-type', 'application/json');
//   xhr.send(JSON.stringify(data));
//
//   console.log(`code: ${code}`);
// }
//
// function inputClickedByBarcode() {
//   console.log('직접 입력 실행 by barcode');
//
//   let barcode = document.getElementById('product_barcode').value;
//
//   console.log(barcode);
//
//   if (!barcode) {
//     window.alert('바코드를 입력해주세요.');
//     return;
//   }
//
//   const data = {
//     barcode: barcode
//   };
//
//   let xhr = new XMLHttpRequest();
//   xhr.onreadystatechange = function() {
//     if (xhr.readyState === 4) {
//       const res = JSON.parse(xhr.response);
//       console.log(`result: ${JSON.stringify(res)}`); //Outputs a DOMString by default
//       if (res.result === true) {
//         initProductsInfo();
//         window.alert(res.msg);
//       } else if (res.result === false) {
//         window.alert(res.msg);
//       }
//     }
//   };
//   xhr.open('POST', `/dbs/sold/barcode`, true);
//   xhr.setRequestHeader('Content-type', 'application/json');
//   xhr.send(JSON.stringify(data));
//
//   // console.log(`code: ${code}`);
// }

// function initProductsInfo() {
//   document.getElementById('product_code').value = '';
//   document.getElementById('product_color').value = '';
//   document.getElementById('product_size').value = '';
// }