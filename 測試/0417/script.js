//雨量
var rainfallStationAPI_URL = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0002-001?Authorization=CWB-326DAE79-B70E-4DD3-BC36-07B077E82CAB&elementName=RAIN&parameterName=CITY,TOWN";


var cwbrainfall = new ol.layer.Vector({
    source: new ol.source.Vector()
})


// console.log(cwbrainfall.getSource().getSource());
$.getJSON(rainfallStationAPI_URL, function (res) {
    // console.log(res);
    var count = Object.keys(res.records.location).length;
    // var features = new Array(count);
    console.log(res);
    for (var i = 0; i < count; ++i) {
        // console.log(res.records.location[i].weatherElement[0].elementValue);
        var coordinates = ol.proj.fromLonLat([res.records.location[i].lon, res.records.location[i].lat]);
        cwbrainfall.getSource().addFeature(new ol.Feature({
            geometry: new ol.geom.Point(coordinates),
            id: res.records.location[i].stationId,
            value: res.records.location[i].weatherElement[0].elementValue,
            time: res.records.location[i].time.obsTime,
            district: res.records.location[i].locationName,
        }))
        cwbrainfall.setStyle(StyleFunction)
    }
})

function StyleFunction(feature, resolution) {
    // console.log(feature.get('value'));
    var setRadius;
    var setImageFill;
    var setImageStroke;
    if(feature.get('value')<0){
        setRadius=5;
        setImageFill='rgba(41, 209, 119, 0.8)';
        // setImageStroke='#39b548'
    }
    if(feature.get('value')>0 & feature.get('value')<30){
        setRadius=8;
        setImageFill='rgba(219, 243, 44, 0.8)';
        // setImageStroke='#b59639';
    }
    if(feature.get('value')>30){
        setRadius=12;
        setImageFill='rgba(219, 43, 22, 0.8)';
        // setImageStroke='#b54039';
    }
    return new ol.style.Style({
        image: new ol.style.Circle({
            radius: setRadius,
            fill: new ol.style.Fill({
                color: setImageFill
            }),
            stroke: new ol.style.Stroke({
                color: setImageStroke,
                width: 0.1
            })
        }),
        // text: createTextStyle(feature, resolution, myDom.points)
    });
}





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



//popup data on map 
var element = document.getElementById('popup');
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

var overlay = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }
});



var map = new ol.Map({
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

// var popup = new ol.Overlay({
//     element: element,
//     positioning: 'bottom-center',
//     stopEvent: false,
//     offset: [0, -10]
// });
// map.addOverlay(popup);


// test = function(){    
// map.on('pointermove', function (evt) {
//     var feature = map.forEachFeatureAtPixel(evt.pixel,
//         function (feature) {

//         }
//     );
// })


// function section
$("#hourRain").click(function () {
    if ($(this).is(":checked")) {
        // O_A0002_001_readRainfallAPI(rainfallStationAPI_URL, rainfallStyle);
        // console.log("123");
        map.addLayer(cwbrainfall)
        // console.log(cwbrainfall.getSource());
    } else {
        map.removeLayer(cwbrainfall);
    }
});


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