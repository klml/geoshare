// register service worker

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/serviceworker.js', { scope: '/' }).then(function(reg) {

    if(reg.installing) {
      console.log('Service worker installing');
    } else if(reg.waiting) {
      console.log('Service worker installed');
    } else if(reg.active) {
      console.log('Service worker active');
    }

  }).catch(function(error) {
    // registration failed
    console.log('Registration failed with ' + error);
  });
}

var geo = document.getElementById("geo");
var osm = document.getElementById("osm");
var adress = document.getElementById("adress");

var osmlink = document.getElementById("osmlink");
var osmreverse = document.getElementById("osmreverse");
var copybtn = document.getElementById("copybtn");
var msg = document.getElementById("msg");
var accuracy = "" ;

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(createLinks);
    } else {
        msg.innerHTML = "Geolocation is not supported by this browser.";
    }
    return ;
}
function createLinks(position) {
    geouri = "geo:" + position.coords.latitude + "," + position.coords.longitude;
    osmurl = "http://www.openstreetmap.org/?mlat="+ position.coords.latitude + "&mlon=" + position.coords.longitude ;
    reverseurl = 'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + position.coords.latitude + '&lon=' + position.coords.longitude ;

    accuracy = Math.round( position.coords.accuracy ) ;

    geo.innerHTML = geouri ;
    osm.innerHTML = osmlink.innerHTML = osmurl ;
    osmlink.setAttribute('href', osmurl );

}

function copyGeo( copytext ) {
      getLocation(); // if device has moved
      copytext.select();
      document.execCommand('copy');
      msg.innerHTML =  "<em>" + copytext.innerHTML + "</em> copied" ;
      copytext.blur() ;
}

var getJSON = function(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };
    xhr.send();
  });
};


function getStreetZipCity(adressfield) {
    msg.innerHTML = "getting adress" ;
    adress.innerHTML = "" ; // blank to avoid old location
    getLocation(); // if device has moved
    getJSON( reverseurl ).then(function(data) {
        var adresslist = data.address ;
        adress.innerHTML =  
        //~ adresslist.building +
        adresslist.road + '\n' +
        //~ adresslist.suburb +
        //~ adresslist.city_district +
        adresslist.postcode +  ' ' +
        adresslist.city + '\n' +
        //~ adresslist.state_district +
        //~ adresslist.state +
        adresslist.country + '\n' +
        "± " + accuracy + "m" ;

        copyGeo( adressfield );

    }, function(status) { 
        msg.innerHTML = status ; // TODO
    });

}