var loc = [];

$.getJSON(
    "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0002-001?Authorization=CWB-326DAE79-B70E-4DD3-BC36-07B077E82CAB&elementName=HOUR_24&parameterName=CITY,TOWN", 
    function(res) {
        console.log(res);
        loc = res.records.location;
});

var iconPoint = ol.proj.fromLonLat([120.950472, 23.814073]);

var iconFeature = new ol.Feature({
    geometry: new ol.geom.Point(iconPoint),
    name: 'Null Island',
    population: 4000,
    rainfall: 500
});

var iconStyle = new ol.style.Style({
    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'https://openlayers.org/en/v4.6.5/examples/data/icon.png'
    }))
});

iconFeature.setStyle(iconStyle);

var vectorSource = new ol.source.Vector({
    features: [iconFeature]
});

var vectorLayer = new ol.layer.Vector({
    source: vectorSource
});

var omsMap = new ol.layer.Tile({
    source: new ol.source.OSM()
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
        vectorLayer
    ],
    target: document.getElementById('map'),
    view: new ol.View({
        projection: 'EPSG:3857',
        center: ol.proj.fromLonLat([120.846642, 23.488793]),
        zoom: 8.3
    }),
    controls: [
        // 'degrees', 'imperial', 'nautical', 'metric', 'us'
        new ol.control.ScaleLine({
          units: 'metric'
        }),
        new ol.control.ZoomSlider(),
        new ol.control.Zoom()
    ]
});

