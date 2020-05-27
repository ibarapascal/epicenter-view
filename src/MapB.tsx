import React from 'react';

import * as esriLoader from "esri-loader";

export default function MapB() {
  React.useEffect(() => {
    esriLoader
      .loadModules([
        "esri/Map",
        "esri/layers/FeatureLayer",
        "esri/views/MapView",
        "esri/core/promiseUtils",
        "esri/widgets/Legend",
        "esri/widgets/Home",
        "esri/widgets/Fullscreen",
        "esri/widgets/Slider",
        "esri/widgets/Expand"
      ])
      .then(([
        Map,
        FeatureLayer,
        MapView,
        promiseUtils,
        Legend,
        Home,
        Fullscreen,
        Slider,
        Expand
      ]) => {
        // https://developers.arcgis.com/javascript/latest/sample-code/visualization-multivariate-2d/index.html
        const colorVisVar = {
          // The type must be set to color for the renderer to know it will use color
          type: "color",
          // Assign the field name to visualize with color
          field: "timestamp",
          // If normalizing set the field to normalize by
          // normalizationField: "magnitude_a",
          // Set the color ramp based on two values (min/max) and two colors
          stops: [
            { value: 1299822360, color: [255, 0, 64] },
            { value: 1299908760, color: [255, 255, 64] }
          ]
        };
        const sizeVisVar = {
          // The type must be set to size for the renderer to know size will be altered
          type: "size",
          // Assign the field name to visualize with size
          field: "magnitude_a",
          // Set the field to normalize the values by
          // normalizationField: "magnitude_a",
          valueUnit: "unknown",
          // Create a size ramp based on the min/max values
          stops: [
            { value: 1, size: 1 },
            { value: 5, size: 7 },
            { value: 9, size: 49 }
          ]
        };
        // https://developers.arcgis.com/javascript/latest/api-reference/esri-renderers-visualVariables-OpacityVariable.html
        const opacityViVar = {
          type: "opacity",
          field: "magnitude_a",
          // maps data values to opacity values
          stops: [
            { value: 1, opacity: 0.1 },
            { value: 5, opacity: 0.5 },
            { value: 9, opacity: 0.9 }
          ]
        };
        const renderer = {
          type: "simple", // autocasts as new SimpleRenderer()
          // Define a default marker symbol.
          symbol: {
            type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
            outline: {
              color: [192, 192, 192],
              width: 0.5
            }
          }, 
          // Set the color and size visual variables on the renderer
          visualVariables: [colorVisVar, sizeVisVar, opacityViVar]
        };
        const pTemplate = {
          // autocasts as new PopupTemplate()
          title: "Time: {timestamp}, Magnitude: {magnitude_a}",
          content:
            "latitude: {latitude}, longitude {longitude}, depth {depth}",
          fieldInfos: [
            {
              fieldName: "latitude",
              format: {
                places: 0,
                digitSeparator: true
              }
            },
            {
              fieldName: "longitude",
              format: {
                places: 0,
                digitSeparator: true
              }
            },
            {
              fieldName: "depth",
              format: {
                places: 0,
                digitSeparator: true
              }
            }
          ]
        }
        const layer = new FeatureLayer({
          url: "https://services6.arcgis.com/VvsGqDoDGHhTumpK/arcgis/rest/services/dt_jp_baseattrs_m1_20110311/FeatureServer",
          title: "Epicenter",
          renderer: renderer,
          popupTemplate: pTemplate
        });
        new MapView({
          map: new Map({
            basemap: 'oceans',
            layers: [layer]
          }),
          container: "viewDiv",
          center: [140, 36],
          zoom: 7
        });
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  return (
    <div>
      <div id="viewDiv" style={{ height: "100vh" }} />
    </div>
  );
}
