import { HOST } from './layerHost'
import { addLayers, removeLayers, addPopUp, toggleVisibility } from './utils'

const npmrdsLayer = {
	name: 'Census ACS',
	loading: false,
    visible: true,
	mapBoxSources: {
    nymtc_areas: {
    		type: 'vector',
    		url: 'mapbox://am3081.32hog1ls'
    },
  	},
  	type: 'Road Lines',
	mapBoxLayers: [
	   {
            'id': 'counties',
            'source': 'nymtc_areas',
            'source-layer': 'counties',
            'maxzoom': 10,
            'type': 'fill',
            'paint': {
                'fill-color': 'rgba(0,0,196,0.25)',
            }
        },
        {
            'id': 'census_tracts',
            'source': 'nymtc_areas',
            'source-layer': 'census_tracts',
            'minzoom': 10,
            'maxzoom': 18,
            'type': 'fill',
            'paint': {
                'fill-color': 'rgba(0,0,196,0.25)',
            }
        }
    ],
	filters: {
        dataset: {
            name: 'Dataset',
            type: 'dropdown',
            domain: [ 
                {value:'64', name:'2017-2021 TIP Mappable Projects'},
                {value:'131', name:'2014-2018 TIP Mappable Projects'}
            ],
            value: 131
        }
	},
	onAdd: addLayers,
	onRemove: removeLayers,
    toggleVisibility: toggleVisibility,
	active: false
}

function fetchData ( layer ) {
	
}

function recieveData ( layer, map) {

} 

export default npmrdsLayer;
