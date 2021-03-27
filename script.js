var rainfallStationAPI_URL = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0002-001?Authorization=CWB-326DAE79-B70E-4DD3-BC36-07B077E82CAB&elementName=NOW&parameterName=CITY,TOWN,ATTRIBUTE";
var weatherStationAPI_URL = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0001-001?Authorization=CWB-326DAE79-B70E-4DD3-BC36-07B077E82CAB&elementName=H_24R&parameterName%EF%BC%8C=CITY,TOWN";
var rainfallStationAPI_Flag = 0;
var weatherStationAPI_Flag = 0;


var map;
var rainfallStationClusters; // for remove rainfall station layers
var weatherStationCluster; // for remove weather station layers
var rainfallStationClusterSource;
var weatherStationClusterSource;

readRainfallAPI = function(){
    $.getJSON(
        rainfallStationAPI_URL,
        function (res) {
            // console.log(res.records.location[0].parameter[1].parameterValue);

            var distance = document.getElementById('distance');

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
                                            district: res.records.location[i].parameter[1].parameterValue,
                                        });
            }

            var source = new ol.source.Vector({
                features: features
            });
            console.log
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
                                radius: 15,
                                stroke: new ol.style.Stroke({
                                    color: '#FAA428'
                                }),
                                fill: new ol.style.Fill({
                                    color: '#FFD162'
                                })
                            }),
                            text: new ol.style.Text({
                                text: size.toString(),
                                fill: new ol.style.Fill({
                                    color: '#000'
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



readWeatherStationAPI = function(){
    $.getJSON(
        weatherStationAPI_URL,
        function (res) {
            var distance = document.getElementById('distance');
            console.log(res);
            var count = Object.keys(res.records.location).length;
            var features = new Array(count);
            for (var i = 0; i < count; ++i) {
                // console.log(res.records.location[i]);
                // console.log(res.records.location[i].weatherElement[0].elementValue);
                var coordinates = ol.proj.fromLonLat([res.records.location[i].lon, res.records.location[i].lat]);
                features[i] = new ol.Feature({
                                            geometry: new ol.geom.Point(coordinates),
                                            id: res.records.location[i].stationId,
                                            // value: res.records.location[i].weatherElement[0].elementValue,
                                            time: res.records.location[i].time.obsTime,
                                            district: res.records.location[i].parameter[1].parameterValue,
                                        });
            }

            var source = new ol.source.Vector({
                features: features
            });
            console.log
            weatherStationClusterSource = new ol.source.Cluster({
                distance: parseInt(distance.value, 10),
                source: source
            });

            var styleCache = {};
            weatherStationCluster = new ol.layer.Vector({
                source: weatherStationClusterSource,
                style: function (feature) {
                    var size = feature.get('features').length;
                    var style = styleCache[size];
                    if (!style) {
                        style = new ol.style.Style({
                            image: new ol.style.Circle({
                                radius: 15,
                                stroke: new ol.style.Stroke({
                                    color: '#fff'
                                }),
                                fill: new ol.style.Fill({
                                    color: '#3399CC'
                                })
                            }),
                            text: new ol.style.Text({
                                text: size.toString(),
                                fill: new ol.style.Fill({
                                    color: '#666666'
                                })
                            })
                        });
                        styleCache[size] = style;
                    }
                    return style;
                }
            });
            
            distance.addEventListener('input', function () {
                weatherStationClusterSource.setDistance(parseInt(distance.value, 10));
                
            });
            map.addLayer(weatherStationCluster);
        }
    )
};





// select checkbox show data
$("#checkBoxRainfallStation").change(function() {
    if(this.checked) {
        readRainfallAPI();
    }else{
        map.removeLayer(rainfallStationClusters);
    }
});

$("#checkBoxWeatherStation").change(function() {
    if(this.checked) {
        readWeatherStationAPI();
    }else{
        map.removeLayer(weatherStationCluster);
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
        url:'https://wmts.nlsc.gov.tw/wmts/EMAP5/default/EPSG:3857/{z}/{y}/{x}.png'
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
        zoom: 8.3
    }),
    overlay:[overlay],
    controls: [
        new ol.control.ZoomSlider()
    ]
});


var popup = new ol.Overlay({
    element: element,
    positioning: 'bottom-center',
    stopEvent: false,
    offset: [0, -10]
});
map.addOverlay(popup);



// decide popup show data and disappear
map.on('pointermove', function(evt){
    var featureClusterNumber;
    var featureCLusterDistrict;
    var feature = map.forEachFeatureAtPixel(evt.pixel,
        function(feature){
            var features = feature.get('features');
            // console.log()
            featureClusterNumber = feature.get('features').length;
            return features;
    });
    if(feature){
        var coordinates = feature[0].getGeometry().getCoordinates();
        popup.setPosition(coordinates);
        document.getElementById("popup").classList.add("ol-popup");

        if(featureClusterNumber==1){// decide range of district 
            content.innerHTML = '<div>'+"站點: "+feature[0].get('id')+"</div>"+
                                '<div>'+"時間: "+feature[0].get('time')+'</div>'+
                                '<div>'+"雨量: "+feature[0].get('value')+" mm"+'</div>'+ 
                                '<div>'+"地區: "+feature[0].get('district')+'</div>';

            overlay.setPosition(coordinates);
        }else{
            var districtString = feature[0].get('district')+",";
            if (featureClusterNumber>5){
                for(var i =1;i<5;i++){
                    if(i==4){
                        districtString+=feature[i].get('district');
                    }
                    if (i<4){
                        districtString+=feature[i].get('district')+",";
                    }
                }
            }else{
                for(var i =1;i<featureClusterNumber;i++){
                    if(i==(featureClusterNumber-1)){
                        districtString+=feature[i].get('district');
                    }
                    if (i<featureClusterNumber-1){
                        districtString+=feature[i].get('district')+",";
                    }
                }
            }
            content.innerHTML = districtString+"....";
            overlay.setPosition(coordinates);
        }
    } else {
        content.innerHTML ="";
        document.getElementById("popup").classList.remove("ol-popup");
        overlay.setPosition(undefined);
    }
    
});

// change mouse cursor when over marker
map.on('pointermove', function(e) {
    var pixel = map.getEventPixel(e.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);
    map.getTarget().style.cursor = hit ? 'pointer' : '';
});