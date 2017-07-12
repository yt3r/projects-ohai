function createCard(obj) {
  var t = document.getElementById('tmplate');

  t.content.querySelector('.stream-name').textContent = obj.streamName;
  t.content.querySelector('.game-name').textContent = obj.gameName;

  t.content.querySelector('img.logo').setAttribute('src', obj.logoImg);
  t.content.querySelector('img.logo').setAttribute('alt', obj.displayName + ' logo');

  t.content.querySelector('.display-name').textContent = obj.displayName;

  if (obj.viewvers) {
    t.content.querySelector('.viewers').textContent = obj.viewers;
  }

//  t.content.querySelector('div').style.backgroundImage = 'url('+obj.preview+')';
  t.content.querySelector('img.preview').setAttribute('src', obj.preview);
  t.content.querySelector('div').dataset.streamUrl = obj.streamUrl;
  t.content.querySelector('div').dataset.streamStat = obj.streamStatus;
  t.content.querySelector('.stream-stat').textContent = obj.streamStatus;

  var card = document.importNode(t.content, true);
  return card;
}

function httpGet(url){
  return new Promise(function (res, rej) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);

    xhr.onload = function() {
      if (this.status>=200 && this.status<400) {
        res(this.response);
      } else {
        var err = new Error(this.statusText);
        err.code = this.status;
        rej(err);
      }
    };

    xhr.onerror = function() {
      rej(new Error('Network error'));
    };

    xhr.send();
  });
}

function promisedTwitch() {
  var regs = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "brunofin"];

  for (var i=0; i< regs.length; i++) {
    var chanURL = "https://cors-anywhere.herokuapp.com/https://wind-bow.gomix.me/twitch-api/channels/" + regs[i];
    var strURL = "https://cors-anywhere.herokuapp.com/https://wind-bow.gomix.me/twitch-api/streams/" + regs[i];

    httpGet(chanURL)
    // first get channel data from one api
    .then(response => {
      console.log(response);
      var channel = JSON.parse(response);
      var streamInfo = {
        'streamName': channel.status,
        'gameName': channel.game,
        'logoImg': channel.logo,
        'displayName': channel.display_name,
        'streamUrl': channel.url,
        'preview': channel.video_banner
      };
      return streamInfo;
    })
    // then check stream status from another
    .then(streamInfo => {
      httpGet(strURL)
        .then(response => {
          console.log(response);
          var stream = JSON.parse(response).stream;
          if (stream === null) {
            streamInfo.streamStatus = 'offline';
          } else {
            streamInfo.streamStatus = 'online';
            streamInfo.viewers = stream.viewers;
          }
          return streamInfo;
        })
        // create summary card
        .then(streamInfo => {
          console.log(streamInfo);
          var card = createCard(streamInfo);
          document.getElementById('results').appendChild(card);
        });
    });
  }
}

function callTwitch(){
  var regs = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];
  for (var i =0; i < regs.length; i++){
    var chanURL = "https://cors-anywhere.herokuapp.com/https://wind-bow.gomix.me/twitch-api/channels/" + regs[i];
    var strURL = "https://cors-anywhere.herokuapp.com/https://wind-bow.gomix.me/twitch-api/streams/" + regs[i];

    var reqChan = new XMLHttpRequest();
    reqChan.open('GET', chanURL, true);
    var streamInfo={};
    reqChan.onload = function(){
      if(this.status>=200 && this.status<400){
        // get stream info

        // get info from channel link
        var channel = JSON.parse(this.response);
        streamInfo = {
          'streamName': channel.status,
          'gameName': channel.game,
          'logoImg': channel.logo,
          'displayName': channel.display_name,
          'streamUrl': channel.url,
          'preview': channel.video_banner
        };

        // get info from stream link
        var reqStream = new XMLHttpRequest();
        reqStream.open('GET',strURL, false);
        reqStream.onload = function(){
          if(this.status>=200 && this.status<400){
            var stream = JSON.parse(this.response).stream;
            if (stream === null) {
              streamInfo.streamStatus = 'offline';
            } else {
              streamInfo.streamStatus = 'online';
              streamInfo.viewers = stream.viewers;
            }
            //console.log(streamInfo);
            var card = createCard(streamInfo);
            document.getElementById('results').appendChild(card);
          }
        };
        reqStream.send();
      }
    };
    reqChan.send();
}

document.getElementById('results').addEventListener('click', function(e){
// if (e.target.nodeName === 'DIV')
    var elem = e.target;
    if (elem.nodeName !== 'DIV') {
       elem = elem.closest('div.card');
    }
    window.open(elem.dataset.streamUrl);
  });
}



document.addEventListener("DOMContentLoaded", promisedTwitch);
document.getElementById('results').addEventListener('click', function(e){
// if (e.target.nodeName === 'DIV')
    var elem = e.target;
    if (elem.nodeName !== 'DIV') {
       elem = elem.closest('div.card');
    }
    window.open(elem.dataset.streamUrl);
  });
