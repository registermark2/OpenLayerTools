var map;


//wmts map 
var wmtsMap = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: 'https://wmts.nlsc.gov.tw/wmts/EMAP5/default/EPSG:3857/{z}/{y}/{x}.png'
    }),
    visible: true
});


var moiMap = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: 'https://rs.happyman.idv.tw/map/moi_osm/{z}/{x}/{y}.png'
    }),
    visible: false
});

var osmMap = new ol.layer.Tile({
    source: new ol.source.OSM({
        url: 'https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
    }),
    visible: false
})



map = new ol.Map({
    layers: [
        wmtsMap, moiMap, osmMap,
        // osmMap,
    ],
    target: document.getElementById('map'),
    view: new ol.View({
        projection: 'EPSG:3857',
        center: ol.proj.fromLonLat([120.846642, 23.488793]),
        zoom: 7.5
    }),
    // overlay: [overlay],
    controls: [
        new ol.control.ScaleLine(),
    ]
});



// function section
$("#moiMap").click(function () {
    if ($(this).is(":checked")) {
        moiMap.setVisible(true);
    } else {
        moiMap.setVisible(false);
    }
});

$("#osmMap").click(function () {
    if ($(this).is(":checked")) {
        osmMap.setVisible(true);
    } else {
        osmMap.setVisible(false);
    }
});