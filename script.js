// var iconFeature = new ol.Feature({
//     geometry: new ol.geom.Point([0, 0]),
//     name: 'Null Island',
//     population: 4000,
//     rainfall: 500
// });

// var iconStyle = new ol.style.Style({
//     image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
//         anchor: [0.5, 46],
//         anchorXUnits: 'fraction',
//         anchorYUnits: 'pixels',
//         src: 'https://openlayers.org/en/v4.6.5/examples/data/icon.png'
//     }))
// });
// iconFeature.setStyle(iconStyle);

// var vectorSource = new ol.source.Vector({
//     features: [iconFeature]
// });

// var vectorLayer = new ol.layer.Vector({
//     source: vectorSource
// });

// var rasterLayer = new ol.layer.Tile({
//     source: new ol.source.TileJSON({
//         url: 'https://api.tiles.mapbox.com/v3/mapbox.geography-class.json?secure',
//         crossOrigin: ''
//     })
// });



// var map = new ol.Map({
//     target: 'map',
//     layers: [
//         rasterLayer, vectorLayer
//         // new ol.layer.Tile({
//         //     source: new ol.source.OSM()})
//     ],
//     view: new ol.View({
//         projection: 'EPSG:3857',
//         center: ol.proj.fromLonLat([120.950472, 23.814073]),
//         zoom: 8
//     })
// });

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

var omsmap = new ol.layer.Tile({
        source: new ol.source.OSM()
    })


var map = new ol.Map({
    layers: [
        omsmap,
        vectorLayer
    ],
    target: document.getElementById('map'),
    view: new ol.View({
        projection: 'EPSG:3857',
        center: ol.proj.fromLonLat([120.950472, 23.814073]),
        zoom: 8
    })
});
