import { HOST } from './layerHost'
import { addLayers, removeLayers, addPopUp, toggleVisibility } from 'pages/MapView/layers/utils'

const npmrdsLayer = {
	name: 'OSM Buildings',
	loading: false,
    visible: true,
	mapBoxSources: {
    nymtc_areas: {
    		type: 'vector',
    		url: 'mapbox://mapbox.mapbox-streets-v7'
        }
  	},
  	mapBoxLayers: [
	   {
            'id': '3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 14,
            'paint': {
                'fill-extrusion-color': '#aaa',

                // use an 'interpolate' expression to add a smooth transition effect to the
                // buildings as the user zooms in
                'fill-extrusion-height': [
                    "interpolate", ["linear"], ["zoom"],
                    15, 0,
                    15.05, ["get", "height"]
                ],
                'fill-extrusion-base': [
                    "interpolate", ["linear"], ["zoom"],
                    15, 0,
                    15.05, ["get", "min_height"]
                ],
                'fill-extrusion-opacity': 0
            }
        }
    ],
	filters: {},
	onAdd: addLayers,
	onRemove: removeLayers,
    toggleVisibility: toggleVisibility,
	active: false
}



export default npmrdsLayer;
