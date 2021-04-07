//雨量
var rainfallStationAPI_URL = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0002-001?Authorization=CWB-326DAE79-B70E-4DD3-BC36-07B077E82CAB&elementName=NOW&parameterName=CITY,TOWN,ATTRIBUTE";
//氣象站
var O_A0001_001_weatherStationAPI_URL = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0001-001?Authorization=CWB-326DAE79-B70E-4DD3-BC36-07B077E82CAB&elementName=H_24R&parameterName%EF%BC%8C=CITY,TOWN";
//氣象站
var O_A0003_001_weatherStationAPI_URL = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-326DAE79-B70E-4DD3-BC36-07B077E82CAB&elementName=24R&parameterName=CITY,TOWN";
//海象監測資料
var O_B0075_001_URL = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-B0075-001?Authorization=CWB-326DAE79-B70E-4DD3-BC36-07B077E82CAB&weatherElement=tideHeight,tideLevel,waveHeight,waveDirection,wavePeriod,seaTemperature,temperature";
var O_B0075_001_seaTide_URL = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-B0075-001?Authorization=CWB-326DAE79-B70E-4DD3-BC36-07B077E82CAB&weatherElement=tideHeight,tideLevel"
// var O_B0075_001_




var flag;


var map;

var rainfallStationClusters;
var rainfallStationClusterSource;
var rainfallStyle = {
    image: {
        radius: 15,
        strokeColor: '#FAA428',
        fillColor: '#FFD162',
    },
    text: '#000',
}


var O_A0001_001_weatherStationCluster;
var O_A0001_001_weatherStationClusterSource;
var O_A0001_001_Style = {
    image: {
        radius: 15,
        strokeColor: '#00AD86',
        fillColor: '#00AD86',
    },
    text: '#fff',
}


var O_A0003_001_weatherStationCluster;
var O_A0003_001_weatherStationClusterSource;
var O_A0003_001_Style = {
    image: {
        radius: 15,
        strokeColor: '#77A4C8',
        fillColor: '#77A4C8',
    },
    text: '#fff',
}



var O_B0075_001_stationCluster;
var O_B0075_001_stationClusterSource;
var O_B0075_001_Style = {
    image: {
        radius: 15,
        strokeColor: '#77A4C8',
        fillColor: '#77A4C8',
    },
    text: '#fff',
}
var O_B0075_001_tideHight;


// read API
O_A0002_001_readRainfallAPI = function (apiPath, featureStyle) {
    $.getJSON(
        apiPath,
        function (res) {
            // console.log(res.records.location[0].parameter[1].parameterValue);

            var distance = document.getElementById('distance');

            var count = Object.keys(res.records.location).length;
            var features = new Array(count);
            for (var i = 0; i < count; ++i) {
                // console.log(res);
                // console.log(res.records.location[i].weatherElement[0].elementValue);
                var coordinates = ol.proj.fromLonLat([res.records.location[i].lon, res.records.location[i].lat]);
                features[i] = new ol.Feature({
                    geometry: new ol.geom.Point(coordinates),
                    id: res.records.location[i].stationId,
                    value: res.records.location[i].weatherElement[0].elementValue,
                    time: res.records.location[i].time.obsTime,
                    // district: res.records.location[i].parameter[1].parameterValue,
                    district: res.records.location[i].locationName,
                    cataId: "O_A0002_001",
                });
            }

            var source = new ol.source.Vector({
                features: features
            });
            // console.log
            rainfallStationClusterSource = new ol.source.Cluster({
                distance: parseInt(distance.value, 10),
                source: source
            });

            var styleCache = {};
            rainfallStationClusters = new ol.layer.Vector({
                source: rainfallStationClusterSource,
                style: function (feature) {
                    var size = feature.get('features').length;
                    var style = styleCache[size];
                    if (!style) {
                        style = new ol.style.Style({
                            image: new ol.style.Circle({
                                radius: featureStyle.image.radius,
                                stroke: new ol.style.Stroke({
                                    color: featureStyle.image.strokeColor
                                }),
                                fill: new ol.style.Fill({
                                    color: featureStyle.image.fillColor
                                })
                            }),
                            text: new ol.style.Text({
                                text: size.toString(),
                                fill: new ol.style.Fill({
                                    color: featureStyle.text
                                })
                            })
                        });
                        styleCache[size] = style;
                    }
                    return style;
                }
            });

            distance.addEventListener('input', function () {
                rainfallStationClusterSource.setDistance(parseInt(distance.value, 10));

            });
            map.addLayer(rainfallStationClusters);

        }
    )
};

O_A0001_001_weatherStationAPI = function (apiPath, featureStyle) {
    $.getJSON(
        O_A0001_001_weatherStationAPI_URL,
        function (res) {
            var distance = document.getElementById('distance');
            // console.log(res);
            var count = Object.keys(res.records.location).length;
            var features = new Array(count);
            for (var i = 0; i < count; ++i) {
                // console.log(res.records.location[i]);
                // console.log(res.records.location[i].weatherElement[0].elementValue);
                var coordinates = ol.proj.fromLonLat([res.records.location[i].lon, res.records.location[i].lat]);
                features[i] = new ol.Feature({
                    geometry: new ol.geom.Point(coordinates),
                    id: res.records.location[i].stationId,
                    value: res.records.location[i].weatherElement[0].elementValue,
                    time: res.records.location[i].time.obsTime,
                    district: res.records.location[i].locationName,
                    cataId: "O_A0001_001",
                });
            }

            var source = new ol.source.Vector({
                features: features
            });
            // console.log
            O_A0001_001_weatherStationClusterSource = new ol.source.Cluster({
                distance: parseInt(distance.value, 10),
                source: source
            });

            var styleCache = {};
            O_A0001_001_weatherStationCluster = new ol.layer.Vector({
                source: O_A0001_001_weatherStationClusterSource,
                style: function (feature) {
                    var size = feature.get('features').length;
                    var style = styleCache[size];
                    if (!style) {
                        style = new ol.style.Style({
                            image: new ol.style.Circle({
                                radius: 15,
                                stroke: new ol.style.Stroke({
                                    color: featureStyle.image.strokeColor
                                }),
                                fill: new ol.style.Fill({
                                    color: featureStyle.image.fillColor
                                })
                            }),
                            text: new ol.style.Text({
                                text: size.toString(),
                                fill: new ol.style.Fill({
                                    color: featureStyle.text
                                })
                            })
                        });
                        styleCache[size] = style;
                    }
                    return style;
                }
            });

            distance.addEventListener('input', function () {
                O_A0001_001_weatherStationClusterSource.setDistance(parseInt(distance.value, 10));

            });
            map.addLayer(O_A0001_001_weatherStationCluster);
        }
    )
};

O_A0003_001_weatherStationAPI = function (apiPath, featureStyle) {
    $.getJSON(
        apiPath,
        function (res) {
            var distance = document.getElementById('distance');
            // console.log(res);
            var count = Object.keys(res.records.location).length;
            var features = new Array(count);
            for (var i = 0; i < count; ++i) {
                // console.log(res.records.location[i]);
                // console.log(res.records.location[i].weatherElement[0].elementValue);
                var coordinates = ol.proj.fromLonLat([res.records.location[i].lon, res.records.location[i].lat]);
                features[i] = new ol.Feature({
                    geometry: new ol.geom.Point(coordinates),
                    id: res.records.location[i].stationId,
                    value: res.records.location[i].weatherElement[0].elementValue,
                    time: res.records.location[i].time.obsTime,
                    district: res.records.location[i].locationName,
                    cataId: "O_A0003_001",
                });
            }

            var source = new ol.source.Vector({
                features: features
            });
            // console.log
            O_A0003_001_weatherStationClusterSource = new ol.source.Cluster({
                distance: parseInt(distance.value, 10),
                source: source
            });

            var styleCache = {};
            O_A0003_001_weatherStationCluster = new ol.layer.Vector({
                source: O_A0003_001_weatherStationClusterSource,
                style: function (feature) {
                    var size = feature.get('features').length;
                    var style = styleCache[size];
                    if (!style) {
                        style = new ol.style.Style({
                            image: new ol.style.Circle({
                                radius: 15,
                                stroke: new ol.style.Stroke({
                                    color: featureStyle.image.strokeColor
                                }),
                                fill: new ol.style.Fill({
                                    color: featureStyle.image.fillColor
                                })
                            }),
                            text: new ol.style.Text({
                                text: size.toString(),
                                fill: new ol.style.Fill({
                                    color: featureStyle.text
                                })
                            })
                        });
                        styleCache[size] = style;
                    }
                    return style;
                }
            });

            distance.addEventListener('input', function () {
                O_A0003_001_weatherStationClusterSource.setDistance(parseInt(distance.value, 10));

            });
            map.addLayer(O_A0003_001_weatherStationCluster);
        }
    )
};

O_B0075_001_API = function (seaSurfaceLoc, apiPath, featureStyle) {
    $.getJSON(
        apiPath,
        function (res) {
            // console.log(res);
            O_B0075_001_tideHight = res.records.seaSurfaceObs.location;
        }
    )
    console.log(O_B0075_001_tideHight);


    $.getJSON(
        seaSurfaceLoc,
        function (res) {
            var distance = document.getElementById('distance');
            // console.log(res);
            var count = Object.keys(res).length;
            var features = new Array(count);
            for (var i = 0; i < count; ++i) {
                // 查詢是否有相同測站
                // for (var stationNumber = 0; stationNumber < O_B0075_001_tideHight.length; stationNumber++) {

                // }



                var coordinates = ol.proj.fromLonLat([res[i].lon, res[i].lat]);
                features[i] = new ol.Feature({
                    geometry: new ol.geom.Point(coordinates),
                    district: res[i].stationName,
                    cataId: "O_B0075_001",
                    id: res[i].id,
                    // value: 
                });
            }

            var source = new ol.source.Vector({
                features: features
            });
            // console.log
            O_B0075_001_stationClusterSource = new ol.source.Cluster({
                distance: parseInt(distance.value, 10),
                source: source
            });

            var styleCache = {};
            O_B0075_001_stationCluster = new ol.layer.Vector({
                source: O_B0075_001_stationClusterSource,
                style: function (feature) {
                    var size = feature.get('features').length;
                    var style = styleCache[size];
                    if (!style) {
                        style = new ol.style.Style({
                            image: new ol.style.Circle({
                                radius: 15,
                                stroke: new ol.style.Stroke({
                                    color: featureStyle.image.strokeColor
                                }),
                                fill: new ol.style.Fill({
                                    color: featureStyle.image.fillColor
                                })
                            }),
                            text: new ol.style.Text({
                                text: size.toString(),
                                fill: new ol.style.Fill({
                                    color: featureStyle.text
                                })
                            })
                        });
                        styleCache[size] = style;
                    }
                    return style;
                }
            });

            distance.addEventListener('input', function () {
                O_B0075_001_stationClusterSource.setDistance(parseInt(distance.value, 10));

            });
            map.addLayer(O_B0075_001_stationCluster);
        }
    )
    // $.getJSON(
    //     apiPath,
    //     function (res) {
    //         console.log(res);
    //         O_B0075_001_tideHight = res
    //     }
    // )
}






// select checkbox show data
var seaSurfaceFlag = 0
$(".seaTide").click(function () {
    if (seaSurfaceFlag == 0) {
        console.log("123");
        O_B0075_001_API("/測試/0406/seaSurfaceLoc.json", O_B0075_001_URL, O_B0075_001_Style);
        seaSurfaceFlag = 1;
        lineChart()
    } else {
        map.removeLayer(O_B0075_001_stationCluster);
        seaSurfaceFlag = 0;
    }
});



var rainfallFlag = 0;
$("#rainfallButton").click(function () {
    if (rainfallFlag == 0) {
        console.log("123");

        O_A0002_001_readRainfallAPI(rainfallStationAPI_URL, rainfallStyle);
        O_A0001_001_weatherStationAPI(O_A0001_001_weatherStationAPI_URL, O_A0001_001_Style);
        O_A0003_001_weatherStationAPI(O_A0003_001_weatherStationAPI_URL, O_A0003_001_Style);
        rainfallFlag = 1;
    } else {
        map.removeLayer(rainfallStationClusters);
        map.removeLayer(O_A0001_001_weatherStationCluster);
        map.removeLayer(O_A0003_001_weatherStationCluster);
        rainfallFlag = 0;
    }
});





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


//wmts map 
var wmtsMap = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: 'https://wmts.nlsc.gov.tw/wmts/EMAP5/default/EPSG:3857/{z}/{y}/{x}.png'
    })
});





map = new ol.Map({
    layers: [
        wmtsMap
    ],
    target: document.getElementById('map'),
    view: new ol.View({
        projection: 'EPSG:3857',
        center: ol.proj.fromLonLat([120.846642, 23.488793]),
        zoom: 7.5
    }),
    overlay: [overlay],
    controls: [
        new ol.control.ScaleLine(),
    ]
});


var popup = new ol.Overlay({
    element: element,
    positioning: 'bottom-center',
    stopEvent: false,
    offset: [0, -10]
});
map.addOverlay(popup);



// cata station data function






// test = function(){    
map.on('pointermove', function (evt) {
    var featureClusterNumber;
    var featureCLusterDistrict;
    var feature = map.forEachFeatureAtPixel(evt.pixel,
        function (feature) {
            var features = feature.get('features');
            // console.log(feature);
            featureClusterNumber = feature.get('features').length;
            return features;
        });
    if (feature) {
        var coordinates = feature[0].getGeometry().getCoordinates();
        popup.setPosition(coordinates);
        document.getElementById("popup").classList.add("ol-popup");

        if (featureClusterNumber == 1) { // decide range of district 
            if (feature[0].get('cataId') == "O_A0002_001") {
                content.innerHTML = '<div>' + "站點: " + feature[0].get('id') + "</div>" +
                    '<div>' + "時間: " + feature[0].get('time') + '</div>' +
                    '<div>' + "雨量: " + feature[0].get('value') + " mm" + '</div>' +
                    '<div>' + "地區: " + feature[0].get('district') + '</div>';

                overlay.setPosition(coordinates);
            }
            if (feature[0].get('cataId') == "O_A0001_001") {
                content.innerHTML = '<div>' + "站點: " + feature[0].get('id') + "</div>" +
                    '<div>' + "時間: " + feature[0].get('time') + '</div>' +
                    '<div>' + "雨量: " + feature[0].get('value') + " mm" + '</div>' +
                    '<div>' + "地區: " + feature[0].get('district') + '</div>';

                overlay.setPosition(coordinates);
            }
            if (feature[0].get('cataId') == "O_A0003_001") {
                content.innerHTML = '<div>' + "站點: " + feature[0].get('id') + "</div>" +
                    '<div>' + "時間: " + feature[0].get('time') + '</div>' +
                    '<div>' + "雨量: " + feature[0].get('value') + " mm" + '</div>' +
                    '<div>' + "地區: " + feature[0].get('district') + '</div>';

                overlay.setPosition(coordinates);
            }
            if (feature[0].get('cataId') == "O_B0075_001") {
                content.innerHTML = '<div>' + "站點: " + feature[0].get('id') + '</div>';

                overlay.setPosition(coordinates);
            }
        } else {
            var districtString = feature[0].get('district') + ",";
            if (featureClusterNumber > 5) {
                for (var i = 1; i < 5; i++) {
                    if (i == 4) {
                        districtString += feature[i].get('district');
                    }
                    if (i < 4) {
                        districtString += feature[i].get('district') + ",";
                    }
                }
            } else {
                for (var i = 1; i < featureClusterNumber; i++) {
                    if (i == (featureClusterNumber - 1)) {
                        districtString += feature[i].get('district');
                    }
                    if (i < featureClusterNumber - 1) {
                        districtString += feature[i].get('district') + ",";
                    }
                }
            }
            content.innerHTML = districtString + "....";
            overlay.setPosition(coordinates);
        }
    } else {
        content.innerHTML = "";
        document.getElementById("popup").classList.remove("ol-popup");
        overlay.setPosition(undefined);
    }

});

// change mouse cursor when over marker
map.on('pointermove', function (e) {
    var pixel = map.getEventPixel(e.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);
    map.getTarget().style.cursor = hit ? 'pointer' : '';
});
// }



// id:[]


// control chartJS
// var ctx = document.getElementById("myChart").getContext('2d');

lineChart = function () {
    var ctx = document.getElementById("myChart").getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["102年", "103年", "104年", "105年", "106年"],
            datasets: [{
                    label: '測試',
                    data: [183.7, 199.2, 201.5, 196.8, 183.4],
                    fill: false,
                    backgroundColor: 'rgba(212, 106, 106, 1)',
                    borderColor: 'rgba(212, 106, 106, 1)'
                },
                {
                    label: '測試',
                    data: [325.1, 321.4, 323.4, 321.4, 322.4],
                    fill: false,
                    backgroundColor: 'rgba(128, 21, 21, 1)',
                    borderColor: 'rgba(128, 21, 21, 1)'
                }
            ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}



var showFlag = 0;
$(".seaTide").click(function () {
    if (showFlag == 0) {
        console.log("123");
        document.getElementById("chartJs").style.display = "block";
        showFlag = 1;
    } else {
        console.log("456");
        document.getElementById("chartJs").style.display = "none";
        showFlag = 0;
    }
});