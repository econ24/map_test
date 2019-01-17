import { HOST } from './layerHost'
import { addLayers, removeLayers, addPopUp, toggleVisibility } from 'pages/MapView/layers/utils'

const npmrdsLayer = {
	name: 'DFIRM Official',
    type:'',
	loading: false,
    visible: true,
	mapBoxSources: {
    dfirm: {
    		type: 'vector',
    		url: 'mapbox://am3081.adgnprsg'
        }
  	},
  	mapBoxLayers: [
	   {
            'id': 'ny-flood-100',
            'source': 'dfirm',
            'source-layer': 'nys_flood_nfhl',
            'filter': [
              "all",
              [
                "match",
                ["get", "FLD_ZONE"],
                [
                  "A",
                  "AE",
                  "AH",
                  "AO",
                  "VE"
                ],
                true,
                false
              ]
            ],
            'type': 'fill',
            'paint': {
                'fill-color': '#35caf3',
            }
        },
        {
            'id': 'ny-flood-500',
            'source': 'dfirm',
            'source-layer': 'nys_flood_nfhl',
            'filter': [
              "all",
              [
                "match",
                ["get", "ZONE_SUBTY"],
                [
                  "0.2 PCT ANNUAL CHANCE FLOOD HAZARD"
                ],
                true,
                false
              ]
            ],
            'type': 'fill',
            'paint': {
                'fill-color': '#1806e5',
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
