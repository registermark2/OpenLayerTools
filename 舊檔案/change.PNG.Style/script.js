// var university = ol.proj.fromLonLat([120.994723, 24.795500]);
// var seniorHigh = ol.proj.fromLonLat([120.994056, 24.798387]);
// var juniorHigh = ol.proj.fromLonLat([121.002308, 24.798110]);
// var elementary = ol.proj.fromLonLat([120.999154, 24.800847]);
var university = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([120.994723, 24.795500]))
});



university.setStyle(new ol.style.Style({
    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
      color: '#8959A8',
      crossOrigin: 'anonymous',
      src: 'https://openlayers.org/en/v4.6.5/examples/data/dot.png'
    }))
}));

var vectorSource = new ol.source.Vector({
    features: [university]
});

var vectorLayer = new ol.layer.Vector({
    source: vectorSource
});

var wmtsMap = new ol.layer.Tile({
    source: new ol.source.XYZ({
    url:
        'https://wmts.nlsc.gov.tw/wmts/EMAP5/default/EPSG:3857/{z}/{y}/{x}.png'
    })
});

var map = new ol.Map({
    layers: [
        wmtsMap,
        vectorLayer],
    target: document.getElementById('map'),
    view: new ol.View({
        projection: 'EPSG:3857',
        center: ol.proj.fromLonLat([120.846642, 23.488793]),
        zoom: 8.3
    }),
});