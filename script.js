//雨量
const rainfallStationAPI_URL = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0002-001?Authorization=CWB-326DAE79-B70E-4DD3-BC36-07B077E82CAB&elementName=NOW&parameterName=CITY,TOWN,ATTRIBUTE";
//氣象站
const O_A0001_001_weatherStationAPI_URL = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0001-001?Authorization=CWB-326DAE79-B70E-4DD3-BC36-07B077E82CAB&elementName=H_24R&parameterName%EF%BC%8C=CITY,TOWN";
//氣象站
const O_A0003_001_weatherStationAPI_URL = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-326DAE79-B70E-4DD3-BC36-07B077E82CAB&elementName=24R&parameterName=CITY,TOWN";
//海象監測資料
const O_B0075_001_URL = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-B0075-001?Authorization=CWB-326DAE79-B70E-4DD3-BC36-07B077E82CAB&weatherElement=tideHeight,tideLevel,waveHeight,waveDirection,seaTemperature,temperature&sort=dataTime";
const O_B0075_001_seaTide_URL = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-B0075-001?Authorization=CWB-326DAE79-B70E-4DD3-BC36-07B077E82CAB&weatherElement=tideHeight,tideLevel"
// var O_B0075_001_


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
var O_B0075_001_tideHight = {};
var level_1_seaTide;
var level_2_seaTide;
var level_3_seaTide;
var seaTideFeatures = [];
var level_seaTide;


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






// read API
O_B0075_001_API = function (seaSurfaceLoc, apiPath, featureStyle) {
    $.getJSON(
        apiPath,
        function (res) {
            console.log(res);
            O_B0075_001_tideStationCount = res.records.seaSurfaceObs.location;
            for (let i = 0; i < O_B0075_001_tideStationCount.length; i++) {
                stationID = res.records.seaSurfaceObs.location[i].station.stationID;
                // console.log(stationID);
                // init every array
                let tempSeaTideData = [];
                let tempSeaTideTime = [];
                for (let temp = 0; temp < O_B0075_001_tideStationCount[i].stationObsTimes.stationObsTime.length; temp++) {
                    //push seaTide 
                    tempSeaTideData.push(O_B0075_001_tideStationCount[i].stationObsTimes.stationObsTime[temp].weatherElements.waveHeight);
                    tempSeaTideTime.push(O_B0075_001_tideStationCount[i].stationObsTimes.stationObsTime[temp].dataTime);
                    // console.log(O_B0075_001_tideStationCount[i].stationObsTimes.stationObsTime[temp].weatherElements.tideHeight);
                }
                O_B0075_001_tideHight[stationID] = {
                    data: tempSeaTideData,
                    time: tempSeaTideTime
                };

            }
            $.getJSON(
                seaSurfaceLoc,
                function (res) {
                    // console.log(res);
                    var count = Object.keys(res).length;
                    // console.log(count);
                    for (var i = 0; i < count; i++) {
                        var coordinates = ol.proj.fromLonLat([res[i].lon, res[i].lat]);
                        // console.log(coordinates);

                        if (res[i].id in O_B0075_001_tideHight) {
                            console.log(res[i].id);


                            //get seaTide 
                            if (O_B0075_001_tideHight[res[i].id].data[0] == 'undefined' ||
                                O_B0075_001_tideHight[res[i].id].data[0] == "None") {
                                continue;
                            }


                            var tempTimeTransfer = []
                            // console.log(res[i].stationName);
                            for (var x = 0; x < O_B0075_001_tideHight[res[i].id].time.length; x++) {
                                console.log(O_B0075_001_tideHight[res[i].id].time[x].slice(0, 13));
                                tempTimeTransfer.push(O_B0075_001_tideHight[res[i].id].time[x].slice(0, 19));
                                console.log(tempTimeTransfer);
                            }


                            seaTideFeatures.push(new ol.Feature({
                                geometry: new ol.geom.Point(coordinates),
                                id: res[i].id,
                                data: O_B0075_001_tideHight[res[i].id].data,
                                // time: O_B0075_001_tideHight[res[i].id].time,
                                time: tempTimeTransfer,
                                level: O_B0075_001_tideHight[res[i].id].data[0],
                                stationName: res[i].stationName,
                                cataId: 'O_B0075_001',
                            }))
                        }
                    }
                    var level_source = new ol.source.Vector({
                        features: seaTideFeatures
                    });

                    level_seaTide = new ol.layer.Vector({
                        source: level_source,
                        style: function (feature) {
                            // console.log(feature.get('data')[0]);
                            var radiusSize;
                            var imageFillColor;
                            if (feature.get('data')[0] < 0.5) {
                                radiusSize = 8;
                                imageFillColor = '#0090ff';
                            }
                            if (feature.get('data')[0] > 0.5 & feature.get('data')[0] < 1) {
                                radiusSize = 10;
                                imageFillColor = '#b5ba28';
                            }
                            if (feature.get('data')[0] > 1) {
                                radiusSize = 15;
                                imageFillColor = '#E85459';
                            }
                            var style = new ol.style.Style({
                                image: new ol.style.Circle({
                                    radius: radiusSize,
                                    stroke: new ol.style.Stroke({
                                        color: '#fff'
                                    }),
                                    fill: new ol.style.Fill({
                                        color: imageFillColor
                                    })
                                }),
                                text: new ol.style.Text({
                                    text: feature.get('data')[0],
                                    fill: new ol.style.Fill({
                                        color: '#fff'
                                    })
                                })
                            });
                            return style;
                        }
                    });
                    // lineChart();
                    map.addLayer(level_seaTide);
                }
            )
        },
        // console.log(O_B0075_001_tideHight),
    )
}


// select checkbox show data
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



var seaSurfaceFlag = 0
$(".seaTide").click(function () {
    if (seaSurfaceFlag == 0) {
        // console.log("123");
        O_B0075_001_API("SeaTide.json", O_B0075_001_URL, O_B0075_001_Style);
        seaSurfaceFlag = 1;
        // lineChart()
    } else {
        map.removeLayer(level_seaTide);
        document.getElementById("chartJs").style.display = "none";
        seaSurfaceFlag = 0;
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
            if (feature.get('cataId') == 'O_B0075_001') {
                // var coordinates = feature.getGeometry().getCoordinates();
                // popup.setPosition(coordinates);
                // document.getElementById("popup").classList.add("ol-popup");
                // content.innerHTML = '<div>' + "站點: " + feature.get('stationName') + '</div>';
                // overlay.setPosition(coordinates);

            } else {
                var features = feature.get('features');
                // console.log(feature);
                featureClusterNumber = feature.get('features').length;
                return features;
            }
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


// }


map.on('click', function (evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
    });
    if (feature) {
        if (feature.get('cataId') == 'O_B0075_001') {
            // document.getElementById("chartJs").style.display = "none";
            var pieChartContent = document.getElementById('chartJs');
            pieChartContent.innerHTML = '&nbsp;';
            $('#chartJs').append('<canvas id="myChart"></canvas>');

            // console.log(feature);
            // console.log(feature.get('data'));
            lineChart(feature.get('stationName'), feature.get('data'), feature.get('time'));
            document.getElementById("chartJs").style.display = "block";
        }
    } else {
        document.getElementById("chartJs").style.display = "none";
    }
});

// change mouse cursor when over marker
map.on('pointermove', function (e) {
    var pixel = map.getEventPixel(e.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);
    map.getTarget().style.cursor = hit ? 'pointer' : '';
});



// chart JS 

lineChart = function (stationName, data, time) {
    var chart;
    var ctx = document.getElementById("myChart").getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            // labels: ["102年", "103年", "104年", "105年", "106年"],
            labels: time,
            datasets: [{
                label: stationName,
                // data: [183.7, 199.2, 201.5, 196.8, 183.4],
                data: data,
                fill: false,
                backgroundColor: 'rgba(212, 106, 106, 1)',
                borderColor: 'rgba(212, 106, 106, 1)'
            }, ]
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