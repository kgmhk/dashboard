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
  // fetch('/dbs/products',{
  //   method: 'get',
  //   dataType: 'json',
  //   headers:{
  //     'Accept': 'application/json',
  //     'Content-Type': 'application/json'
  //   }
  // })
  //   .then((response) => {
  //     console.log('response : ', response);
  //     return response.json();
  //   })
  //   .then((responseData) => {
  //     console.log('responseData: ',responseData);
  //     attachElement(responseData);
  //   })
  //   .then(() => {
  //     console.log('final');
  //     // $('#table').bootstrapTable({
  //     //   data: data
  //     // });
  //   })
  //   .catch((error)=>{
  //     console.log('Error fetching man',error);
  //   });
});
//
// $(function () {
//
//   console.log('functin()');
//
//
//   $('#table').bootstrapTable({
//     data: data
//   });
//
//   console.log('functin() end');
// });

// document.addEventListener("DOMContentLoaded",function(){
//     console.log('resady');
//
//     fetch('/dbs/products',{
//         method: 'get',
//         dataType: 'json',
//         headers:{
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         }
//     })
//     .then((response) => {
//         console.log('response : ', response);
//         return response.json();
//     })
//     .then((responseData) => {
//         console.log('responseData: ',responseData);
//         attachElement(responseData);
//     })
//       .then(() => {
//         console.log('final');
//         // $('#table').bootstrapTable({
//         //   data: data
//         // });
//       })
//     .catch((error)=>{
//         console.log('Error fetching man',error);
//     });
//     //here code
// });

function attachElement(args) {
    let products = args;
    let sizeArray = [130,140,150,160,170,180,190,200,210,220,230,240,250,260,270];

    let shoesInfo = {};
    sizeArray.forEach(size => {
        products.forEach(product => {
            if (shoesInfo[product.code]) {
                if (!shoesInfo[product.code][size] && product.size === size) {
                    shoesInfo[product.code][size] = product.count;
                } else if (!shoesInfo[product.code][size]) {
                    shoesInfo[product.code][size] = 0;
                }
            } else {
                console.log('product.size : ', product.size);
                console.log('size : ', size);
                console.log('count : ', product.count);

                shoesInfo[product.code] = {
                    code: product.code,
                    color: product.color,
                    inputPrice: product.input_price,
                    outputPrice: product.output_price,
                    brand: product.brand_name
                };

                shoesInfo[product.code][product.size] = product.count

            }
        })
    });

    console.log('shoesInfo : ', shoesInfo);


    data = _.map(shoesInfo, shoe => {
      return shoe;
    })

   console.log('shoe : ', data);

    // var table = document.createElement('table');
    // table.setAttribute('data-toggle', 'table');
    // table.classList.add('table');
    // table.classList.add('table-striped');
    // var thead = document.createElement('thead');
    // var tbody = document.createElement('tbody');
    // var theadTr = document.createElement('tr');
    // // var tbodyTr = document.createElement('tr');
    //
    // document.getElementById('products').appendChild(table);
    // table.appendChild(thead);
    // table.appendChild(tbody);
    // thead.appendChild(theadTr);



    let theadTrList = ['code', 'color', '입고가격', '판매가격', '브랜드명', '130', '140', '150', '160', '180', '190', '200', '210',
        '220', '225', '230', '235','240', '245', '250', '255', '260', '265', '270', '275', '280', '285', '290', '295', '300'];

    let tbodyTrList = ['code', 'color', 'inputPrice', 'outputPrice', 'brand', '130', '140', '150', '160', '180', '190', '200', '210',
      '220', '225', '230', '235','240', '245', '250', '255', '260', '265', '270', '275', '280', '285', '290', '295', '300'];

    // theadTrList.forEach((list, index) => {
    //     var th = document.createElement('th');
    //     th.setAttribute('data-field', `type`);
    //     th.setAttribute('data-sortable', 'true');
    //     var text = document.createTextNode(list);
    //     th.appendChild(text);
    //     theadTr.appendChild(th);
    // });

    var tbody = document.getElementById('products');


    _.map(shoesInfo, (product, index) => {

        var tbodyTr = document.createElement('tr');
        tbodyTr.setAttribute('data-index', `${index}`);
        tbodyTrList.forEach((key, index)=> {
            var th = document.createElement('td');
            var value = product[key] === undefined ? 0 : product[key];
            var text = document.createTextNode(value);
            if (value && index > 4) th.setAttribute('style', 'color:red');
            th.appendChild(text);
            // tbodyTr.appendChild(th);
        });
        // tbody.appendChild(tbodyTr);


        console.log('product', product);
        return product;
    });

    return;
}