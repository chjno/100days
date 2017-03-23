var publicIp = require('public-ip');
var dns = require('dns');
var geolib = require('geolib');
var maxmind = require('maxmind');

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
  console.log(msg);
  if (msg.type == 'url'){
    geolocate(sender.tab.id, msg.url);
    // console.log('geolocate', msg.url);
  }
});

var originIp;
var origin;
publicIp.v4().then(ip => {
    console.log('origin ip', ip);
    originIp = ip;

    var mmdb = chrome.extension.getURL('GeoLite2-City.mmdb');
    maxmind.open(mmdb, (err, cityLookup) => {
      var city = cityLookup.get(ip);

      origin = {
        latitude: city.location.latitude,
        longitude: city.location.longitude
      };

      console.log('origin', origin);

    });
});

function geolocate(tabId, url){
  dns.lookup(url, function (err, ip, family){
    if (err){
      console.log('err');
      extractDomain(url);
      return;
    }

    console.log(ip);

    maxmind.open('./GeoLite2-City.mmdb', (err, cityLookup) => {
      var city = cityLookup.get(ip);

      var target = {
        latitude: city.location.latitude,
        longitude: city.location.longitude
      };

      var meters = geolib.getDistance(
        {latitude: 40.729779199999996, longitude: -73.99343809999999},
        target
      );

      var miles = Math.round(meters / 1609.344);

      var dir = geolib.getCompassDirection(
        {latitude: 40.729779199999996, longitude: -73.99343809999999},
        target
      ).exact;

      console.log(miles, 'miles', dir);

      chrome.tabs.sendMessage(tabId, {type: 'distance', distance: miles, direction: dir});

    });
  });
}

function extractDomain(url) {
  var domain;
  if (url.indexOf("://") > -1) {
    domain = url.split('/')[2];
  }
  else {
    domain = url.split('/')[0];
  }

  domain = domain.split(':')[0];
  geolocate(domain);
}