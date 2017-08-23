function inactiveChan(obj) {
	
	let t = document.getElementById('inactive');
	
	t.content.querySelector('.display-name').textContent = obj.displayName;
	
	t.content.querySelector('div').dataset.streamStat = obj.streamStatus;
	t.content.querySelector('.stream-name').textContent = obj.errorMsg;
	
	let card = document.importNode(t.content, true);
	return card;
}

function activeChan(obj) {
  
	let t = document.getElementById('active');

	t.content.querySelector('.stream-name').textContent = obj.streamName;
	t.content.querySelector('.game-name').textContent = obj.gameName;

	t.content.querySelector('img.logo').setAttribute('src', obj.logoImg);
	t.content.querySelector('img.logo').setAttribute('alt', obj.displayName + ' logo');

	t.content.querySelector('.display-name').textContent = obj.displayName;
	
	if (!obj.preview) {
		obj.preview = './inactive.png';
	}
	t.content.querySelector('img.preview').setAttribute('src', obj.preview);
	t.content.querySelector('img.preview').setAttribute('alt', obj.displayName + '\'s preview');
	t.content.querySelector('div').dataset.streamUrl = obj.streamUrl;
	t.content.querySelector('div').dataset.streamStat = obj.streamStatus;
	t.content.querySelector('.stream-stat').textContent = obj.streamStatus;

	let card = document.importNode(t.content, true);
	return card;
}

function createCard(obj) {
	
	if (obj.active) {
		
		return activeChan(obj);
		
	} else {
		
		return inactiveChan(obj);
		
	}

}

function fetchStream (url, options, info) {
	return new Promise ((resolve, reject) => {
		fetch(url, options)
			.then(response => {
				return response.json();
			})
			.then(json => {
				if(!json.stream) {
					info.streamStatus = 'offline';
				} else {
					info.streamStatus = 'online';
				}
				resolve(info);
			});
	});
}

function fetchChannel (url, options, info) {
	return new Promise ((resolve, reject)=>{
		fetch(url, options)
			.then(response => {
				return response.json();
			})
			.then(json => {
				if (json.status === 404) {
					info.displayName = json.message.match(/"(.*?)"/)[1];
					info.errorMsg = json.message;
					info.active = false;
				} else {
					info.streamName = json.status;
					info.gameName = json.game;
					info.logoImg = json.logo;
					info.displayName = json.display_name;
					info.streamUrl = json.url;
					info.preview = json.video_banner;
					info.active = true;
				}
				resolve(info);
			});
	});
}

const urlAPI = "https://cors-anywhere.herokuapp.com/https://wind-bow.gomix.me/twitch-api/";
const channels = ["ESL_SC2", "OgamingSC2", "xboct", "cretetion", "freecodecamp", "habathcx", "RobotCaleb", "noobs2ninjas", "brunofin"];
const opts = {
	method: "GET",
	mode: "cors"
}

function fetchAdd() {
	for (let i = 0; i < channels.length; i++) {
		let streamInfo = {};
		
		
		fetchStream(urlAPI + "streams/" + channels[i], opts, streamInfo)
			.then(streamInfo => {
				fetchChannel (urlAPI + "channels/" + channels[i], opts, streamInfo)
					.then(streamInfo => {
						let card = createCard(streamInfo);
						document.getElementById('results').appendChild(card);
					});

				});
	}
}

function showFiltered(elems, state) {
	
	if (state === 'all') {
		
		for (let i=0; i<elems.length; i++) {
			
			elems[i].removeAttribute('style');
			
		}
		
	} else {
		
		for (let i=0; i<elems.length; i++) {
		
			if (elems[i].dataset.streamStat !== state) {
				
				elems[i].style.display = 'none';
				
			} else {
				
				if (elems[i].style.display === 'none') {
					
					elems[i].removeAttribute('style');
					
				}
			}
		}
	}
	
}

let buttons = document.getElementsByTagName('button');

function filter() {
	let currState = this.id;
	let results = document.getElementById('results').children;
	
	if (this.classList.contains('active')) return;
	
	for (let i=0; i< buttons.length; i++) {
		buttons[i].classList.remove('active');
	}
	
	showFiltered(results, currState);
	
	
	this.classList.add('active');
}

document.addEventListener('DOMContentLoaded', fetchAdd);

document.getElementById('results').addEventListener('click', function(e){
// if (e.target.nodeName === 'DIV')
	
    let elem = e.target;
    if (elem.nodeName !== 'DIV') {
       elem = elem.closest('div.card');
    }
	
    window.open(elem.dataset.streamUrl);
  });

for (let i = 0; i < buttons.length; i++) {
	buttons[i].addEventListener('click', filter);
}