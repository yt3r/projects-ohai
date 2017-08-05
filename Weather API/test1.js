function getForecast(loc){
    const key = '1653283a22ccbc03b35ef6574db1fbd4'
    let uri = 'https://crossorigin.me/https://api.darksky.net/forecast/' + key +'/' + loc; //https://crossorigin.me/ for codepen
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
              let forecast = JSON.parse(this.response);
              console.log(forecast);

              const fah = Math.floor(forecast.currently.temperature).toString();
              const cel = Math.floor((fah - 32)*5/9).toString();
              const wType = forecast.currently.summary;
              const wIcon = forecast.currently.icon;
              const btn = document.getElementById('toggle-degree');

              const degree = document.getElementById('degree');
              degree.innerHTML = cel + ' &degC';

              function degreeSwitch(){
                if (degree.dataset.degree === 'cel') {
                  degree.innerHTML = fah + '&degF';
                  degree.dataset.degree = 'fah';
                }
                else if (degree.dataset.degree === 'fah') {
                  degree.innerHTML = cel + '&degC';
                  degree.dataset.degree = 'cel';
                }
              }


              let icon = new Skycons ({'color': 'black'});
              document.getElementById('weather-type').textContent = wType;

              icon.add(document.getElementById('weather-icon'), wIcon);
              icon.play();

              btn.addEventListener('click', degreeSwitch);
      }
    };
    req.open('GET', uri, true);
    req.send();
  }

  function getCoords() {
    const ipApiURL = "https://ipinfo.io/json/";
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
              let data = JSON.parse(this.response);
              document.getElementById('place').textContent = data.city;
              getForecast(data.loc);
      }
    };
    req.open('GET', ipApiURL, true);
    req.send();
  }

  document.addEventListener('DOMContentLoaded', function() {

    getCoords();

  });