import React from "react"

import store from "store"
import { falcorGraph } from "store/falcorGraph"
import { update } from "utils/redux-falcor/components/duck"

import MapLayer from "../AvlMap/MapLayer"

const testParcelLayer = new MapLayer("Test Parcel Layer", {
  sources: [
    { id: "nys_parcels_test",
      source: {
        'type': "vector",
        'url': 'mapbox://am3081.6o6ny609'
      }
    }
  ],
  layers: [
    { 'id': 'nys_1811_parcels_test',
      'source': 'nys_parcels_test',
      'source-layer': 'nys_1811_parcels',
      'minzoom': 10,
      'type': 'fill',
      'paint': {
          'fill-color': 'rgba(0, 196, 0, 0.1)',
      }
    },
    { 'id': 'nys_1811_parcels_select',
      'source': 'nys_parcels_test',
      'source-layer': 'nys_1811_parcels',
      'minzoom': 10,
      'type': 'fill',
      'paint': {
          'fill-color': 'rgba(0, 196, 0, 1)',
      }
    }
  ],
  select: {
    highlightLayers: [
      { id: 'nys_1811_parcels_select' }
    ],
    fromLayers: ['nys_1811_parcels_test'],
    property: "OBJECTID",
    selection: [],
    maxSelection: 10000
  }
})

export default testParcelLayer