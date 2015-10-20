

L.mapbox.accessToken = 'pk.eyJ1IjoibWxsb3lkIiwiYSI6Im9nMDN3aW8ifQ.mwiVAv4E-1OeaoR25QZAvw';
var map = L.mapbox.map('dc-map','mlloyd.noehc1pf', {
  scrollWheelZoom: false,
  minZoom: 12
}).setView([38.898, -77.046], 12);

map.on('click', function(e) {
    console.log(e.latlng);
});