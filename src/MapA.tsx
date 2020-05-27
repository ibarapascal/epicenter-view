import React from 'react';

import * as esriLoader from "esri-loader";

const widthBase = 1;
const widthRate = 1.414;
const timeMin = 1299822360;
const timeMax = 1299908760;
const timeGap = timeMax - timeMin;

// {"depth":"388","magnitude_a":"7","timestamp":"441795821","latitude":"33.6233","longitude":"136.8383"}
// const realData = require('./data/test.json');

const realData = require('./data/DT_JP_BaseAttrs_M1_from_2011_3_11.json');
// const realData = require('./data/DT_JP_BaseAttrs_M5.json');

interface DataItems {
  timestamp: string,
  latitude: string,
  longitude: string,
  magnitude_a: string,
  depth: string
}

const data = realData.data.filter((x: DataItems) => {
  const time = Number(x.timestamp);
  return time > timeMin && time < timeMax;
});

console.log(data.length);

export default function MapA() {
  React.useEffect(() => {
    esriLoader
      .loadModules([
         // ! Notice sort matters
        // "esri/layers/FeatureLayer",
        "esri/Map",
        "esri/views/SceneView", // * earth
        // "esri/views/MapView", // * flat
        "esri/layers/GraphicsLayer",
        "esri/Graphic",
        // "esri/PopupTemplate",
        // "esri/widgets/Legend"
      ])
      .then(([
        // FeatureLayer,
        Map,
        MapView,
        GraphicsLayer,
        Graphic,
        // PopupTemplate,
        // Legend
      ]) => {

        /**
         * * Init Map
         * https://developers.arcgis.com/javascript/latest/api-reference/esri-Map.html#basemap
         */
        const map = new Map({
          // basemap: 'topo'
          // basemap: 'terrain'
          basemap: 'oceans',
          // layers: [featureLayer] // !
        });
        /**
         * * View Map
         * https://developers.arcgis.com/javascript/latest/sample-code/intro-graphics/index.html
         */
        new MapView({
          map: map,
          container: "viewDiv", // DOM element's id
          center: [140, 36],
          zoom: 7
        });

        /**
         * * Points Graphic
         * https://developers.arcgis.com/javascript/latest/api-reference/esri-Graphic.html#constructors
         */
        const graphicsLayer = new GraphicsLayer();
        const graphicsList = data.map((x: any) => {
          // https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Point.html
          const point = {
            type: 'point', // autocasts as new Point()
            latitude: x.latitude,
            longitude: x.longitude,
            spatialReference: map.spatialReference
          };
          // https://developers.arcgis.com/javascript/latest/api-reference/esri-symbols-Symbol.html
          const symbol = {
            type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
            color: colorCalculator(Number(x.timestamp)),
            outline: {
              color: [192, 192, 192],
              width: 1
            },
            size: sizeCalculator(Number(x.magnitude_a))
          };
          return new Graphic({
            geometry: point,
            symbol: symbol,
          })
        })
        // https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-GraphicsLayer.html
        graphicsLayer.addMany(graphicsList);

        /**
         * * Add Graphic Layers
         */
        map.add(graphicsLayer);
        // map.add(featureLayer); // !

        /**
         * ! attributes
         */
        // const attr = {
        //   Xcoord: 'xxxxxx',
        //   Ycoord: 'yyyyyy',
        //   Plant: "zzzzzz",
        //   Name: 'Epicenter',
        //   Owner: 'ibarapascal',
        //   Length: "3,456 km"
        // }
        // attributes: attr

        /**
         * ! popupTemplate
         */
        // // https://developers.arcgis.com/javascript/latest/api-reference/esri-PopupTemplate.html
        // const popupTemplate = {
        //   title: 'Epicenter',
        //   // content: 'Some content'
        //   // content: `Vernal Pool Locations","Latitude: ${x.latitude} <br/>
        //   //   Longitude: ${x.longitude} <br/>
        //   //   Plant Name: xxx`
        // }
        // const featureLayer = new FeatureLayer({
        //   url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/ACS_Marital_Status_Boundaries/FeatureServer/2",
        //   popupTemplate: popupTemplate
        // })

        /**
         * ! Legend
         */
        // // https://developers.arcgis.com/javascript/latest/sample-code/sandbox/index.html?sample=intro-popuptemplate
        // view.ui.add(new Legend({ view: view }), "bottom-left");

      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  
  const colorCalculator = (value: number) => {
    const diffRate = (timeMax - value) / timeGap;
    return [255, 255 * (1 - diffRate), 64];
  }

  const sizeCalculator = (value: number) => {
    return widthBase * Math.pow(widthRate, value);
  }

  return (
    <div>
      <div id="viewDiv" style={{ height: "100vh" }} />
    </div>
  );
}
