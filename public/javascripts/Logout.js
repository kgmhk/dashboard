function logout() {
  console.log('logout');
  var xhr = new XMLHttpRequest();
  xhr.open('GET', `/logout`, true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send();
  location.href = '/';
}