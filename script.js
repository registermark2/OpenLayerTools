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
                // console.log(res.records.location[i].lon);
                var coordinates = ol.proj.fromLonLat([res.records.location[i].lon, res.records.location[i].lat]);
                features[i] = new ol.Feature(new ol.geom.Point(coordinates));
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
            // var wmtsMap = new ol.layer.Tile({
            //     source: new ol.source.XYZ({
            //         url:
            //             'https://wmts.nlsc.gov.tw/wmts/EMAP5/default/EPSG:3857/{z}/{y}/{x}.png'
            //     })
            // });

            // map = new ol.Map({
            //     layers: [
            //         wmtsMap,

            //     ],
            //     target: document.getElementById('map'),
            //     view: new ol.View({
            //         projection: 'EPSG:3857',
            //         center: ol.proj.fromLonLat([120.846642, 23.488793]),
            //         zoom: 8.3
            //     }),
            //     // controls: [
            //     //     // 'degrees', 'imperial', 'nautical', 'metric', 'us'
            //     //     new ol.control.ScaleLine({
            //     //         units: 'metric'
            //     //     }),
            //     //     new ol.control.ZoomSlider(),
            //     //     new ol.control.Zoom()
            //     // ]
            // });
            distance.addEventListener('input', function () {
                clusterSource.setDistance(parseInt(distance.value, 10));
            });
            map.addLayer(clusters);
            
            // addCluster = function () {
            //     map.addLayer(clusters);
            // };
            // removeCluster = function() {
            //     map.removeLayer(clusters);
            // };
        }
    )
};

// test = function(){
//     $.getJSON(
//         "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0002-001?Authorization=CWB-326DAE79-B70E-4DD3-BC36-07B077E82CAB&elementName=NOW&parameterName=CITY,TOWN,ATTRIBUTE",
//         function (res) {
//             console.log(res);
//         }
//     )
// }


addCluster = function () {
    readRainfallAPI();
};
removeCluster = function() {
    map.removeLayer(clusters);
};


$.getJSON(
    "https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0002-001?Authorization=CWB-326DAE79-B70E-4DD3-BC36-07B077E82CAB&elementName=NOW&parameterName=CITY,TOWN,ATTRIBUTE",
    function (res) {
        
    }
);




















































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
        // 'degrees', 'imperial', 'nautical', 'metric', 'us'
        new ol.control.ScaleLine({
            units: 'metric'
        }),
        new ol.control.ZoomSlider(),
        new ol.control.Zoom()
    ]
});