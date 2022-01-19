<template>
  <div>
    <div
      id="map" 
      class="fit absolute overflow-hidden" 
    />  
    
    <div id="popup" class="ol-popup">
      <a style="cursor: pointer" id="popup-closer" class="ol-popup-closer"></a>
      <div id="popup-content">
        <p v-show="dadosFeature.logradouro"><span class="small text-muted">Logradouro:</span> {{dadosFeature.logradouro}}</p>
        <p v-show="dadosFeature.numero"><span class="small text-muted">Número:</span> {{dadosFeature.numero}}</p>
        <p v-show="dadosFeature.municipio"><span class="small text-muted">Município:</span>  {{dadosFeature.municipio}}</p>
        <p v-show="dadosFeature.estado"><span class="small text-muted">Estado:</span>  {{dadosFeature.estado}}</p>
      </div>
    </div>    
  </div>
</template>

<script>
require('ol/ol.css')
import Map from 'ol/Map'
import View from 'ol/View'
import Tile from 'ol/layer/Tile'
import WMS from 'ol/source/TileWMS'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector' 
import Style from 'ol/style/Style'
import Icon from 'ol/style/Icon'
import Overlay from 'ol/Overlay'
import Vue from 'vue'
import axios from 'axios'
import { Buffer} from 'buffer';
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
export default {
  props: ['features'],

  data () {
    return {
      mapa: null,
      pointsLayer: null,
      dadosFeature: {}
    };
  },

  watch: {
    features: function () {
      
      this.loadFeatures();
    }
  },

  
  mounted () {
    const URL = process.env.PROXY+'/mapa-demo/dinamico';  
    /* global ol:true */
    let baseMap = new Tile({
      title: 'OI Mapas',
      source: new WMS({
        url: URL,
        serverType: 'geoserver',
        crossOrigin: null,
        tileLoadFunction: this.wmsImageLoad,
        params: {'LAYERS': 'OIBDMUB:BASE_MAP', 'TILED': true, 'VERSION': '1.3.0', 'FORMAT': 'image/png8', 'WIDTH': 256, 'HEIGHT': 256, 'SRS': 'EPSG:4326'}
      })
    });

    let pointsLayer = new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        image: new Icon(({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          src: require('../assets/img/ic_place_black_18dp_2x.png')
        }))
      })
    });
    //console.log(pointsLayer);
    this.pointsLayer = pointsLayer;

    this.mapa = new Map({
      layers: [baseMap, pointsLayer],
      target: 'map',
      view: new View({
        projection: 'EPSG:4326',
        center: [-19.937137, -43.937039,17],
        zoom: 3
      })
    });
    // this.mapa.addControl(new ol.control.LayerSwitcher());

    this.loadFeatures();
  },

  methods: {
    loadFeatures () {
      var points = [];
      for (var i = 0; i < this.features.length; i++) {
        let feature = this.features[i];
        points.push(
          new Feature({
            dadosFeature: feature,
            geometry: new Point([feature.longitude, feature.latitude])
          })
        );
      }
      
      this.pointsLayer.getSource().clear(true);
      if (points.length > 0) {
        this.pointsLayer.getSource().addFeatures(points);
        let zoom = 16;

        if (points.length === 1) {
          if (this.features[0].descricaoTipoRetorno === 'UF') {
            zoom = 6;
          } else if (this.features[0].descricaoTipoRetorno === 'LOCALIDADE/MUNICÍPIO') {
            zoom = 10;
          }
        }
        
        this.mapa.getView().fit(this.pointsLayer.getSource().getExtent(), {
          maxZoom: zoom
        });
      }

      this.addInfoWindow();
    },
    addInfoWindow () {
      var me = this;
      var container = document.getElementById('popup');
      var closer = document.getElementById('popup-closer');

      var overlay = new Overlay(({
        element: container,
        autoPan: true,
        autoPanAnimation: {
          duration: 250
        }
      }));
      
      me.mapa.addOverlay(overlay);

      closer.onclick = function () {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
      };

      me.mapa.on('pointermove', function (evt) {
        me.mapa.getTargetElement().style.cursor = me.mapa.hasFeatureAtPixel(evt.pixel) ? 'pointer' : '';
      });
        
      me.mapa.on('singleclick', function (evt) {
        let center = me.mapa.getView().getCenter();
        me.mapa.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
          me.dadosFeature = feature.values_.dadosFeature;
          let coordinate = evt.coordinate;
          overlay.setPosition(coordinate);
          me.mapa.getView().setCenter(center);
        });
      });
    },
    wmsImageLoad (tile, src) {
      axios.get(src, { responseType: 'arraybuffer' }).then(response => {
        console.log(response);
        const data = 'data:image/png;base64,' + Buffer.from(response.data).toString('base64');
        console.log(data);
        tile.getImage().src = data;
      });
    }
  }
};
</script>


<style scoped>
      .ol-popup {
        position: absolute;
        background-color: white;
        -webkit-filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
        filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
        padding: 15px;
        border-radius: 10px;
        border: 1px solid #cccccc;
        bottom: 12px;
        left: -50px;
        min-width: 280px;
      }
      .ol-popup:after, .ol-popup:before {
        top: 100%;
        border: solid transparent;
        content: " ";
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
      }
      .ol-popup:after {
        border-top-color: white;
        border-width: 10px;
        left: 48px;
        margin-left: -10px;
      }
      .ol-popup:before {
        border-top-color: #cccccc;
        border-width: 11px;
        left: 48px;
        margin-left: -11px;
      }
      .ol-popup-closer {
        text-decoration: none;
        position: absolute;
        top: 2px;
        right: 8px;
      }
      .ol-popup-closer:after {
        content: "✖";
      }
</style>
