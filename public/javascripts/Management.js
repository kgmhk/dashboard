document.addEventListener("DOMContentLoaded",function(){
    console.log('open management');
});

function directInputClicked() {
  console.log('직접 입력 실행');

  let code = document.getElementById("product_code").value;
  let color = document.getElementById("product_color").value;
  let inputPrice = document.getElementById("product_input_price").value;
  let outputPrice = document.getElementById("product_output_price").value;
  let brand = document.getElementById("product_brand").value;
  let size = document.getElementById("product_size").value;

  if (!code || !color | !inputPrice || !outputPrice || !brand || !size) {
    window.alert("항목을 모두 입력해주세요.");
  }

  // const data = new FormData();
  // data.append('code', code);
  // data.append('color', color);
  // data.append('inputPrice', inputPrice);
  // data.append('outputPrice', outputPrice);
  // data.append('brand', brand);
  // data.append('size', size);

  const data = {
    code: code,
    color: color,
    inputPrice: inputPrice,
    outputPrice: outputPrice,
    brand: brand,
    size: size
  };

  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      console.log(xhr.response); //Outputs a DOMString by default

    }
  };
  xhr.open('POST', `/dbs/products`, true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(JSON.stringify(data));

  console.log(`code: ${code}`);
}