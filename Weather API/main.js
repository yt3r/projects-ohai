function fetchPromise(url, options) {
    return new Promise ((resolve, reject) => {
      fetch(url, options)
        .then(response => {
          return response.json();
        })
        .then(json => {
          resolve(json);
        });
    });
  }
  
  function showWeather(forecast){
    const fah = Math.floor(forecast.currently.temperature).toString();
    const cel = Math.floor((fah - 32)*5/9).toString();
    const wType = forecast.currently.summary;
    const wIcon = forecast.currently.icon;
    
    document.getElementById('degree').innerHTML = cel + ' &degC';
    document.getElementById('degree').style.display = 'block';
    
    const currDate = new Date();
    console.log(currDate);
    document.getElementById('date-time').textContent = currDate.toLocaleString();
    
    function degreeSwitch(e){
      let curr = e.target.dataset.degree;
      if (curr == 'cel') {
        e.target.innerHTML = fah + '&degF';
        e.target.dataset.degree = 'fah';
      } else {
        e.target.innerHTML = cel + '&degC';
        e.target.dataset.degree = 'cel';
      }
    }
    
    let icon = new Skycons ({'color': '#373737' });
    document.getElementById('weather-type').textContent = wType;
    icon.add(document.getElementById('weather-icon'), wIcon);
    icon.play();
    
    document.getElementById('degree').addEventListener('click', degreeSwitch);
    
  }
  
  const opts = { method: "GET",
                  mode: "cors"};
  
  const uriIP = "https://cors-anywhere.herokuapp.com/https://ipinfo.io/json/";
  
  const key = '1653283a22ccbc03b35ef6574db1fbd4'
  const uriWeather = 'https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/' + key + '/'; //https://crossorigin.me/ for codepen

  document.addEventListener('DOMContentLoaded', function() {
    let info = {};
    fetchPromise(uriIP, opts)
      .then(info =>{
        document.getElementById('place').textContent = info.city;
        fetchPromise(uriWeather + info.loc, opts)
        .then(forecast => {
          console.log(forecast);
          showWeather(forecast);
        });
      });
  });