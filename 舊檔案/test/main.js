import 'ol/ol.css';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import Point from 'ol/geom/Point';
import TileJSON from 'ol/source/TileJSON';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import {
    Icon,
    Style
} from 'ol/style';
import {
    Tile as TileLayer,
    Vector as VectorLayer
} from 'ol/layer';

var iconFeature = new Feature({
    geometry: new Point([0, 0]),
    name: 'Null Island',
    population: 4000,
    rainfall: 500,
});

var iconStyle = new Style({
    image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'data/icon.png',
    }),
});

iconFeature.setStyle(iconStyle);

var vectorSource = new VectorSource({
    features: [iconFeature],
});

var vectorLayer = new VectorLayer({
    source: vectorSource,
});

var rasterLayer = new TileLayer({
    source: new TileJSON({
        url: 'https://a.tiles.mapbox.com/v3/aj.1x1-degrees.json?secure=1',
        crossOrigin: '',
    }),
});

var map = new Map({
    layers: [rasterLayer, vectorLayer],
    target: document.getElementById('map'),
    view: new View({
        center: [0, 0],
        zoom: 3,
    }),
});

var element = document.getElementById('popup');

var popup = new Overlay({
    element: element,
    positioning: 'bottom-center',
    stopEvent: false,
    offset: [0, -50],
});
map.addOverlay(popup);

// display popup on click
map.on('click', function (evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
    });
    if (feature) {
        var coordinates = feature.getGeometry().getCoordinates();
        popup.setPosition(coordinates);
        $(element).popover({
            placement: 'top',
            html: true,
            content: feature.get('name'),ß
        });
        $(element).popover('show');
    } else {
        $(element).popover('dispose');
    }
});

// change mouse cursor when over marker
map.on('pointermove', function (e) {
    if (e.dragging) {
        $(element).popover('dispose');
        return;
    }
    var pixel = map.getEventPixel(e.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);
    map.getTarget().style.cursor = hit ? 'pointer' : '';
});