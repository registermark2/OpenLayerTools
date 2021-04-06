function cluster(elementID, color) {
    this.distance = document.getElementById(elementID);
    var count = 20000;
    this.features = new Array(count);
    this.e = 4500000;


    for (var i = 0; i < count; ++i) {
        this.coordinates = [2 * this.e * Math.random() - this.e, 2 * this.e * Math.random() - this.e];
        this.features[i] = new ol.Feature(new ol.geom.Point(this.coordinates));
    }

    this.source = new ol.source.Vector({
        features: this.features
    });


    this.clusterSource = new ol.source.Cluster({
        distance: parseInt(this.distance.value, 10),
        source: this.source
    });


    var styleCache = {};
    this.clusters = new ol.layer.Vector({
        source: this.clusterSource,
        style: function (feature) {
            var size = feature.get('features').length;
            var style = styleCache[size];
            if (!style) {
                style = new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 10,
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
                            color: color
                        })
                    })
                });
                styleCache[size] = style;
            }
            return style;
        }
    });

    

    return {
        clusters: this.clusters,
        clusterSource: this.clusterSource,
    }
}



var testPoint = new cluster('distance1', '#B22222');
distance1.addEventListener('input', function () {
    testPoint.clusterSource.setDistance(parseInt(distance1.value, 10));
});

var testPoint2 = new cluster('distance2', '#E6B800');
distance2.addEventListener('input', function () {
    testPoint2.clusterSource.setDistance(parseInt(distance2.value, 10));
});




//wmts map 
var wmtsMap = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: 'https://wmts.nlsc.gov.tw/wmts/EMAP5/default/EPSG:3857/{z}/{y}/{x}.png'
    })
});

var map = new ol.Map({
    layers: [wmtsMap, testPoint.clusters, testPoint2.clusters],
    target: 'map',
    view: new ol.View({
        center: [0, 0],
        zoom: 2
    })
});

