
var m = L.map("map").setView([46.861967, -113.982825], 17);

var stamenAttribution = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; ' +
        'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';
var umAttribution = 'Map tiles by <a href="http://www.umt.edu/map/about.php">UM</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; ' +
        'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';

var tiles = L.layerGroup(
        [
            L.tileLayer(
                    "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                    {
                        minZoom: 4,
                        maxZoom: 18
                    }
            ),
            L.tileLayer(
                    "http://tile1.map.umt.edu/tiles/tiles.py/composite/{z}/{x}/{y}.png",
                    {
                        minZoom: 4,
                        maxZoom: 22,
                        attribution: umAttribution
                    }
            )
        ]
        ).addTo(m);
//D3 Poly layer
var d3Poly = L.d3("../data/bldgpolys.geojson", {pathClass: function (d) {
        return "poly l" + d.properties.extrude;
    },
});//.addTo(m);
d3Poly.bindPopup(function (p) {
    var out = [];
    for (var key in p) {
        if (p[key] && p[key] !== "" && ["Shape_Length", "OBJECTID"].indexOf(key) === -1) {
            out.push("<strong>" + key + "</strong>: " + p[key]);
        }
    }
    return "<ul><li>" + out.join("</li><li>") + "</li></ul>";
});
//D3 line layer
var d3Line = L.d3("../data/links.geojson", {pathClass: function (d) {
        return "status l" + d.properties.util;
    },
});//.addTo(m);
d3Line.bindPopup(function (p) {
    var out = [];
    for (var key in p) {
        if (p[key] && p[key] !== "" && ["Shape_Length", "OBJECTID"].indexOf(key) === -1) {
            out.push("<strong>" + key + "</strong>: " + p[key]);
        }
    }
    return "<ul><li>" + out.join("</li><li>") + "</li></ul>";
});
//D3 point layer
var d3points = L.d3("../data/bldg_centroids.geojson", {pathClass: function (d) {
        return "class l" + d.properties.wireless;
    },
}).addTo(m);
d3points.bindPopup(function (p) {
    var out = [];
    for (var key in p) {
        if (p[key] && p[key] !== "" && ["Shape_Length", "OBJECTID"].indexOf(key) === -1) {
            out.push("<strong>" + key + "</strong>: " + p[key]);
        }
    }
    return "<ul><li>" + out.join("</li><li>") + "</li></ul>";
});
//add tilelayer
var umToner = L.tileLayer(
        'http://tile1.map.umt.edu/tiles/tiles.py/composite_bw/{z}/{x}/{y}.png',
        {
            minZoom: 14,
            maxZoom: 22,
            attribution: umAttribution
        }
);
//add geojson layer via leaflet only
function popUp(feature, layer) {
    layer.bindPopup("Name: " + feature.properties.name);
}
var pointLayer = new L.GeoJSON.AJAX("json/points.json", {onEachFeature: popUp});
var lineLayer = new L.GeoJSON.AJAX("json/lines.json", {onEachFeature: popUp});
var polyLayer = new L.GeoJSON.AJAX("json/polys.json", {onEachFeature: popUp});
//pointLayer.addTo(m);
//lineLayer.addTo(m);
//polyLayer.addTo(m);
L.control.layers({"UM Basemap": tiles, "UM Tonor": umToner}, {"Campus Links": d3Line}, {collapsed: false}).addTo(m);


