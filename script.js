var rainfallStationAPI_URL = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0002-001?Authorization=CWB-326DAE79-B70E-4DD3-BC36-07B077E82CAB&elementName=NOW&parameterName=CITY,TOWN,ATTRIBUTE";
var weatherStationAPI_URL = "";


var map;
var clusters;
var clusterSource;

readRainfallAPI = function(){
    $.getJSON(
        rainfallStationAPI_URL,
        function (res) {
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
                                        });
            }

            var source = new ol.source.Vector({
                features: features
            });
            console.log
            clusterSource = new ol.source.Cluster({
                distance: parseInt(distance.value, 10),
                source: source
            });

            var styleCache = {};
            clusters = new ol.layer.Vector({
                source: clusterSource,
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
                clusterSource.setDistance(parseInt(distance.value, 10));
                
            });
            map.addLayer(clusters);
            
        }
    )
};
// readWeatherStationAPI = function(){
//     $.getJSON(
//         weatherStationAPI_URL,
//         function (res) {

//         }
//     )
// };

$("#checkBox").change(function() {
    if(this.checked) {
        readRainfallAPI();
    }else{
        map.removeLayer(clusters);
    }
});


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


map.on('pointermove', function(evt){
    var featureClusterNumber;
    var feature = map.forEachFeatureAtPixel(evt.pixel,
        function(feature){
            var features = feature.get('features');
            featureClusterNumber = feature.get('features').length;
            return features[0]; //get cluster value level
    });
    if(feature){
        // console.log(feature);
        var coordinates = feature.getGeometry().getCoordinates();
        popup.setPosition(coordinates);
        document.getElementById("popup").classList.add("ol-popup");

        if(featureClusterNumber<2){
            content.innerHTML = '<div>'+"站點: "+feature.get('id')+'</div>'+
                                '<div>'+"雨量: "+feature.get('value')+" mm"+'</div>'+ 
                                '<div>'+"時間: "+feature.get('time')+'</div>';
            overlay.setPosition(coordinates);
        }else{
            content.innerHTML = '<div>'+featureClusterNumber+'個測站'+'</div>';
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