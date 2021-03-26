var rainfallStationAPI_URL = "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0002-001?Authorization=CWB-326DAE79-B70E-4DD3-BC36-07B077E82CAB&elementName=NOW&parameterName=CITY,TOWN,ATTRIBUTE";



var map;
var clusters;

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
                                        });
            }

            var source = new ol.source.Vector({
                features: features
            });

            var clusterSource = new ol.source.Cluster({
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
                                    color: '#fff'
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
            // console.log("addCluster");
        }
    )
};





addCluster = function () {
    readRainfallAPI();
};
removeCluster = function() {
    map.removeLayer(clusters);
    // console.log("delete cluster layers");
};



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
    controls: [
        new ol.control.ScaleLine({
            units: 'metric'
        }),
        new ol.control.ZoomSlider(),
        new ol.control.Zoom()
    ]
});


var element = document.getElementById('popup');

var popup = new ol.Overlay({
    element: element,
    positioning: 'bottom-center',
    stopEvent: false,
    offset: [0, -10]
});
map.addOverlay(popup);



map.on('pointermove', function(evt){
    var feature = map.forEachFeatureAtPixel(evt.pixel,
        function(feature){
            var features = feature.get('features');
                console.log(features[0]);
                return features[0];  
    });
    if(feature){
        var coordinates = feature.getGeometry().getCoordinates();
        popup.setPosition(coordinates);
        // console.log("isFeature");
        // console.log(feature.get('id'));
        $(element).popover({
            'placement': 'top',
            'html': true,
            'content': 
            "<div>"+"ID:"+feature.get('id') +"</div>"
            +"<div>"+"<p>"+"value: "+feature.get('value')+ "</div>",
            // feature.get('id'),
            // 'content': feature.get('value')
        });
        $(element).popover('show');
    } else {
        // console.log("noFeature");
        $(element).popover('destroy');
    }
    
});
// change mouse cursor when over marker
map.on('pointermove', function(e) {
    if (e.dragging) {
        $("#popup").popover('destroy');
        return;
    }
    var pixel = map.getEventPixel(e.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);
    map.getTarget().style.cursor = hit ? 'pointer' : '';
});