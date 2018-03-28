

function onClicked() {

    let id = document.getElementById('account_id').value;
    let pw = document.getElementById('account_pw').value;

    if (!id || !pw) {
        window.alert("id or pw 를 입력하세요.");
        return;
    }

    console.log('id:', id, 'pw: ', pw);


    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        console.log(xhr.response); //Outputs a DOMString by default

      }
    }
    xhr.open('GET', '/dbs/accounts?id='+id+'&pw='+pw, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}