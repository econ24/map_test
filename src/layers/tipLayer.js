import { HOST } from './layerHost'
import { addLayers, removeLayers, addPopUp, toggleVisibility } from './utils'
var WKT = require('terraformer-wkt-parser');

const TipProjects = {
	name: 'TIP Mappable Projects',
	loading: false,
    visible: true,
	mapBoxSources: {},
  	type: '',
	mapBoxLayers: [],
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
    toggleVisibility: toggleVisibility,
	onAdd: addLayers,
	onRemove: removeLayers,
    fetchData: fetchData,
    receiveData: receiveData,
	active: false,
}

function fetchData ( layer ) {
	return fetch(`${HOST}views/${layer.filters.dataset.value}/data_overlay`)
        .then(response => response.json())
}


function receiveData ( data, map) {
    console.log('HUB BOUND recieveData', data,map)


    let colors = data.symbologies[0].color_scheme.reduce( (out,curr) => {
        out[curr.value] = curr.color
        return out; 
    }, {})

    let features = data.data.map(d => {
    	return {
              "type": "Feature",
              "properties": {
                Cost: `$${d.cost}M`,
				County: d.county,
				Description: d.description,
				MPO: d.mpo,
				Type: d.ptype,
				color: colors[d.ptype],
				Sponsor: d.sponsor,
				"TIP ID": d.tip_id
              },
              "geometry": WKT.parse(d.geography)
            }
    })
    
    let tip_points = features.filter(f => f.geometry.type === 'Point')
   	let tip_roads = features.filter(f => f.geometry.type !== 'Point')

    map.addLayer({
        'id': 'tip_points',
        'type': 'circle',
        'source': {
            'type': 'geojson',
            'data':  { "type": "FeatureCollection", "features": tip_points }
        },
        paint: {
            'circle-radius': 5,
            'circle-opacity': 0.8,
            'circle-color': ['string', ['get', 'color']]
        }
    })

     map.addLayer({
        'id': 'tip_lines',
        'type': 'line',
        'source': {
            'type': 'geojson',
            'data':  { "type": "FeatureCollection", "features": tip_roads }
        },
        paint: {
            'line-width': 3,
            'line-opacity': 0.8,
            'line-color': ['string', ['get', 'color']]
        }
    })

    let popUpOptopns = {
        rows: ['Type','TIP ID', 'Sponsor', 'MPO', 'County',  'Cost', 'Description']
    }

    addPopUp(map, 'tip_points', popUpOptopns)
    // addPopUp(map, 'tip_lines', popUpOptopns)
} 


export default TipProjects;
