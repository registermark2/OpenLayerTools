// window.onload = init;

// function init() {
//雨量 1h
var rainfallStationAPI_URL = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0002-001?Authorization=CWB-326DAE79-B70E-4DD3-BC36-07B077E82CAB&elementName=RAIN&parameterName=CITY,TOWN";

var tempStationAPI_URL = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0001-001?Authorization=CWB-326DAE79-B70E-4DD3-BC36-07B077E82CAB&elementName=TEMP&parameterName%EF%BC%8C=CITY,TOWN";
// tideHeight,waveHeight,temperature
// var cwbSeaWaveStation_URL = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-B0075-001?Authorization=CWB-326DAE79-B70E-4DD3-BC36-07B077E82CAB&weatherElement=tideHeight&sort=dataTime"
var cwbSeaWaveStation_URL = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-B0075-001?Authorization=CWB-326DAE79-B70E-4DD3-BC36-07B077E82CAB&weatherElement=tideHeight,tideLevel,waveHeight,waveDirection,seaTemperature,temperature&sort=dataTime";

//海象監測資料
// const O_B0075_001_URL = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-B0075-001?Authorization=CWB-326DAE79-B70E-4DD3-BC36-07B077E82CAB&weatherElement=tideHeight,tideLevel,waveHeight,waveDirection,seaTemperature,temperature&sort=dataTime";
// const seaTide_URL = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-B0075-001?Authorization=CWB-326DAE79-B70E-4DD3-BC36-07B077E82CAB&weatherElement=tideHeight,tideLevel"





var cwbRainfall = new ol.layer.Vector({
    source: new ol.source.Vector()
})
var cwbTemp = new ol.layer.Vector({
    source: new ol.source.Vector()
})

var cwbSeaWaveStation = new ol.layer.Vector({
    source: new ol.source.Vector()
})






// rainfall
$.getJSON(rainfallStationAPI_URL, function (res) {
    // console.log(res);
    var count = Object.keys(res.records.location).length;
    // var features = new Array(count);
    // console.log(res);
    for (var i = 0; i < count; ++i) {
        // console.log(res.records.location[i].weatherElement[0].elementValue);
        var coordinates = ol.proj.fromLonLat([res.records.location[i].lon, res.records.location[i].lat]);



        cwbRainfall.getSource().addFeature(new ol.Feature({
            geometry: new ol.geom.Point(coordinates),
            id: res.records.location[i].stationId,
            value: res.records.location[i].weatherElement[0].elementValue,
            // value: nValue,
            time: res.records.location[i].time.obsTime,
            district: res.records.location[i].locationName,
        }))
        cwbRainfall.setStyle(rainfallStyleFunction)
    }
})

function rainfallStyleFunction(feature, resolution) {
    // console.log(feature.get('value'));
    var setRadius;
    var setImageFill;
    var setImageStroke;
    if (feature.get('value') <= 0) {
        setRadius = 0;
        setImageFill = 'rgba(41, 209, 119, 0.8)';
        // setImageStroke='#39b548'
    }
    if (feature.get('value') > 0 & feature.get('value') < 30) {
        setRadius = 5;
        setImageFill = 'rgba(219, 243, 44, 0.8)';
        // setImageStroke='#b59639';
    }
    if (feature.get('value') > 30) {
        setRadius = 7;
        setImageFill = 'rgba(219, 43, 22, 0.8)';
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



// temperature
$.getJSON(tempStationAPI_URL, function (res) {
    // console.log(res);
    var count = Object.keys(res.records.location).length;
    // var features = new Array(count);
    // console.log(res);
    for (var i = 0; i < count; ++i) {
        // console.log(res.records.location[i].weatherElement[0].elementValue);
        var coordinates = ol.proj.fromLonLat([res.records.location[i].lon, res.records.location[i].lat]);

        cwbTemp.getSource().addFeature(new ol.Feature({
            geometry: new ol.geom.Point(coordinates),
            id: res.records.location[i].stationId,
            value: res.records.location[i].weatherElement[0].elementValue,
            // value: nValue,
            time: res.records.location[i].time.obsTime,
            district: res.records.location[i].locationName,
        }))
        cwbTemp.setStyle(tempStyleFunction)
    }
})

function tempStyleFunction(feature, resolution) {
    // console.log(feature.get('value'));
    var setRadius;
    var setImageFill;
    var setImageStroke;
    if (feature.get('value') <= 20) {
        setRadius = 5;
        setImageFill = 'rgba(109, 201, 255, 0.8)';
        // setImageStroke='#39b548'
    }
    if (feature.get('value') > 20 & feature.get('value') < 25) {
        setRadius = 5;
        setImageFill = 'rgba(255, 199, 0, 0.8)';
        // setImageStroke='#b59639';
    }
    if (feature.get('value') > 25) {
        setRadius = 5;
        setImageFill = 'rgba(255, 93, 0, 0.8)';
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

// seaWave
var tempSeaTide = {};
var stationID;
$.getJSON("./seaTide.json", function (res) {
    $.getJSON(cwbSeaWaveStation_URL, function (resUrl) {
        console.log(resUrl);
        var count = Object.keys(resUrl.records.seaSurfaceObs.location).length;
        // console.log(count);
        for (var i = 0; i < count; i++) {
            console.log(resUrl.records.seaSurfaceObs.location[i].station.stationID);
            stationID = resUrl.records.seaSurfaceObs.location[i].station.stationID;
            var tempData = resUrl.records.seaSurfaceObs.location[i].stationObsTimes.stationObsTime[0].weatherElements.waveHeight;
            if (tempData == 'undefined' || tempData == "None" || tempData == null) {
                tempData = 0;
            } else {
                tempData = resUrl.records.seaSurfaceObs.location[i].stationObsTimes.stationObsTime[0].weatherElements.waveHeight;

            }
            tempSeaTide[stationID] = {
                data: tempData
            }
        }

        // combine data 
        count = Object.keys(res).length;

        var localJsonID;
        var localJsonDep;
        for (var i = 0; i < count; i++) {
            localJsonID = res[i].id;
            localJsonDep = res[i].dep;
            if (tempSeaTide[localJsonID] != null) {
                // console.log(localJsonID);
                // console.log(tempSeaTide[localJsonID]);
                var coordinates = ol.proj.fromLonLat([res[i].lon, res[i].lat]);
                cwbSeaWaveStation.getSource().addFeature(new ol.Feature({
                    geometry: new ol.geom.Point(coordinates),
                    id: localJsonID,
                    value: tempSeaTide[localJsonID].data,
                    dep: localJsonDep,
                    time: resUrl.records.seaSurfaceObs.location[i].stationObsTimes.stationObsTime[0].dataTime,
                    // time: res.records.location[i].time.obsTime,
                    // district: res.records.location[i].locationName,
                }))
                cwbSeaWaveStation.setStyle(seaTideStyleFunction)
            }
        }

    })
})

function seaTideStyleFunction(feature, resolution) {
    var imageSrc;
    console.log(feature.get('value'));
    if (feature.get('value') <= 0) {
        imageSrc = './picture/16piexl-triangle-button-green.png';
    }
    if (feature.get('value') >= 1.5) {
        imageSrc = './picture/16piexl-triangle-button-red.png';
    }
    if (feature.get('value') > 0 && feature.get('value') < 1.5) {
        imageSrc = './picture/16piexl-triangle-button-yellow.png';
    }
    return new ol.style.Style({
        image: new ol.style.Icon( /** @type {olx.style.IconOptions} */ ({
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: imageSrc,
        }))
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


var SAR_layer_1 = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: './kml/layer-1.kml',
        format: new ol.format.KML()
    }),
    visible: false
});
var SAR_layer_5 = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: './kml/layer-5.kml',
        format: new ol.format.KML()
    }),
    visible: false
});
var SAR_layer_8 = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: './kml/layer-8.kml',
        format: new ol.format.KML()
    }),
    visible: false
});





var map = new ol.Map({
    layers: [
        wmtsMap, moiMap, osmMap, SAR_layer_1, SAR_layer_5, SAR_layer_8
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


const popupContainerElement = document.getElementById('popup');

var popup = new ol.Overlay({
    element: popupContainerElement,
    positioning: 'bottom-center',
    stopEvent: false,
    offset: [0, -50]
});
map.addOverlay(popup);


// test = function(){    
map.on('pointermove', function (evt) {
    var decideLayer = 0;
    var feature = this.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
        // console.log(layer);
        switch (layer) {
            // case test:
            case cwbRainfall:
                console.log(1);
                decideLayer = 1;
                break;
            case cwbTemp:
                console.log(2);
                decideLayer = 2;
                break;
            case cwbSeaWaveStation:
                console.log(3);
                decideLayer = 3;
                break;
        }
        return feature;
    });
    if (decideLayer > 0) {
        this.getTargetElement().style.cursor = 'pointer';
        switch (decideLayer) {

            case 1:
                var coordinates = feature.getGeometry().getCoordinates();

                popup.setPosition(undefined);
                popup.setPosition(coordinates);

                popupContainerElement.innerHTML = '<div>' + "站點: " + feature.get('id') + "</div>" +
                    '<div>' + "時間: " + feature.get('time') + '</div>' +
                    '<div>' + "雨量: " + feature.get('value') + " mm" + '</div>' +
                    '<div>' + "地區: " + feature.get('district') + '</div>';
                break;

            case 2:
                var coordinates = feature.getGeometry().getCoordinates();

                popup.setPosition(undefined);
                popup.setPosition(coordinates);

                popupContainerElement.innerHTML = '<div>' + "站點: " + feature.get('id') + "</div>" +
                    '<div>' + "時間: " + feature.get('time') + '</div>' +
                    '<div>' + "溫度: " + feature.get('value') + " 度" + '</div>' +
                    '<div>' + "地區: " + feature.get('district') + '</div>';
                break;

            case 3:
                var coordinates = feature.getGeometry().getCoordinates();

                popup.setPosition(undefined);
                popup.setPosition(coordinates);

                popupContainerElement.innerHTML = '<div>' + "站點: " + feature.get('id') + "</div>" +
                    '<div>' + "時間: " + feature.get('time') + '</div>' +
                    '<div>' + "浪高: " + feature.get('value') + " m" + '</div>' +
                    '<div>' + "管轄單位: " + feature.get('dep') + '</div>';
                break;

        }
    } else {
        popup.setPosition(undefined);
        popupContainerElement.innerHTML = "";
        this.getTargetElement().style.cursor = '';
    }
});


// function section
$("#hourRain").click(function () {
    if ($(this).is(":checked")) {
        // O_A0002_001_readRainfallAPI(rainfallStationAPI_URL, rainfallStyle);
        // console.log("123");
        map.addLayer(cwbRainfall)
        // console.log(cwbRainfall.getSource());
    } else {
        map.removeLayer(cwbRainfall);
    }
});

$("#temp").click(function () {
    if ($(this).is(":checked")) {
        map.addLayer(cwbTemp)
    } else {
        map.removeLayer(cwbTemp);
    }
});

$("#seaWave").click(function () {
    if ($(this).is(":checked")) {
        map.addLayer(cwbSeaWaveStation)
    } else {
        map.removeLayer(cwbSeaWaveStation);
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

$("#sar").click(function () {
    if ($(this).is(":checked")) {
        SAR_layer_1.setVisible(true);
        SAR_layer_5.setVisible(true);
        SAR_layer_8.setVisible(true);
    } else {
        SAR_layer_1.setVisible(false);
        SAR_layer_5.setVisible(false);
        SAR_layer_8.setVisible(false);
    }
});


// }