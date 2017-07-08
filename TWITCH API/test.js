function createCard(obj) {
  var t = document.getElementById('tmplate');

  t.content.querySelector('.stream-name').textContent = obj.streamName;
  t.content.querySelector('.game-name').textContent = obj.gameName;

  t.content.querySelector('img').setAttribute('src', obj.logoImg);

  t.content.querySelector('.display-name').textContent = obj.displayName;

  if (obj.viewvers) {
    t.content.querySelector('.viewers').textContent = obj.viewers;
  }

  t.content.querySelector('div').style.backgroundImage = 'url('+obj.preview+')';
  t.content.querySelector('div').dataset.streamUrl = obj.streamUrl;
  t.content.querySelector('.stream-stat').textContent = obj.streamStatus;

  var card = document.importNode(t.content, true);
  return card;
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



document.addEventListener("DOMContentLoaded", callTwitch);
