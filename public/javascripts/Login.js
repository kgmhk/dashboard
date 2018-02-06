

function onClicked() {

    let id = document.getElementById('account_id').value;
    let pw = document.getElementById('account_pw').value;

    if (!id || !pw) {
        window.alert("id or pw 를 입력하세요.");
        return;
    }

    console.log(`id: ${id}, pw: ${pw}`);


    var xhr = new XMLHttpRequest();
    xhr.open('GET', `/dbs/accounts?id=${id}&pw=${pw}`, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();

  location.href="/products";
    // fetch(`/dbs/accounts?id=${id}&pw=${pw}`,{
    //     method: 'get',
    //     dataType: 'json',
    //     // headers:{
    //     //     'Accept': 'application/json',
    //     //     'Content-Type': 'application/json'
    //     // }
    // })
    //     .then((response) => {
    //         console.log('response : ', response);
    //         return response;
    //     })
    //     .then((responseData) => {
    //         console.log('responseData: ',responseData);
    //         if (responseData) location.href='/products';
    //         else window.alert('id 혹은 pw가 틀렸습니다.');
    //     })
    //     .catch((error)=>{
    //         console.log('Error fetching man',error);
    //     });
    // location.href="/products";
}