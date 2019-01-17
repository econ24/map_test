import { HOST } from './layerHost'
import { addLayers, removeLayers, addPopUp, toggleVisibility } from './utils'


const hubLayer = {
	name: 'HUB Bound',
	loading: false,
    visible: true,
	mapBoxSources: {
        hub_bound: {
    		type: 'geojson',
    		data: {"type":"FeatureCollection","crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:OGC:1.3:CRS84"}},"features":[{"type":"Feature","properties":{"OBJECTID":59,"DATEMOD":null,"NAME":"New York","ABBREVIATI":"NY","POP1990":1487536,"POP2000":1537195,"COUNTY_FIP":"36061","SP_ZONE":"Long Island","SHAPE_LEN":94479.50845107119},"geometry":{"type":"Polygon","coordinates":[[[-73.95754926445754,40.75853265287229],[-73.95834666390564,40.75780932971569],[-73.96204802274403,40.753860968291505],[-73.9674604266275,40.747387432240735],[-73.9699242541538,40.74464836684684],[-73.97117898104219,40.74282634698002],[-73.97159504067402,40.74205532886421],[-73.9721632813649,40.73938038442234],[-73.97270841522021,40.735750335626676],[-73.97403267748231,40.73627559600201],[-73.9740098809453,40.7359285692786],[-73.97290676246134,40.73146858728116],[-73.97086917757245,40.72973883485178],[-73.97096422498156,40.727604680756734],[-73.97104037639728,40.72645678241221],[-73.97322978953105,40.719746963876204],[-73.97566320077428,40.713453651525235],[-73.97698397981803,40.711375399771825],[-73.97729386981788,40.710900696456356],[-73.97788181524389,40.71053205108076],[-73.98092096912107,40.710216601563204],[-73.98101794045279,40.70982558912457],[-73.98829761291366,40.708907698684484],[-73.98857859827447,40.70960381282739],[-73.99677080231274,40.70841411633865],[-73.99777221758382,40.70814355218047],[-73.99826950469946,40.70784158097557],[-74.00086621294996,40.7065218215341],[-74.00835943967857,40.70188850559627],[-74.00944064205281,40.701366285594936],[-74.0111301800766,40.700727656234136],[-74.01161123945911,40.70061466270788],[-74.01185273443943,40.70029242642882],[-74.01287456881076,40.7001300063463],[-74.01404736374131,40.70036524103682],[-74.01719600119773,40.7015677033904],[-74.0183757590293,40.702843436746306],[-74.01908603639205,40.703898963888946],[-74.01967598026782,40.704786809762865],[-74.0195741161052,40.70638495180643],[-74.0191826170981,40.70704825442707],[-74.01870152341314,40.70716127596051],[-74.0185511559602,40.70772753398659],[-74.01912192268735,40.707957596987264],[-74.01818732180374,40.712147609853886],[-74.01695423428627,40.71217314857962],[-74.01680342190005,40.71327089909702],[-74.01791592842054,40.713496575008485],[-74.01697997452345,40.718371204663846],[-74.0138171551298,40.718227115002406],[-74.01224009167876,40.725244745747574],[-74.01184468201116,40.72806100882162],[-74.01495876952053,40.728479495816835],[-74.01429539302346,40.73040164557133],[-74.01034042992444,40.748862138476426],[-74.00897407039203,40.752233076699156],[-74.00821411403822,40.754248939727376],[-74.00773633933146,40.75496100255975],[-74.00555337851183,40.75791048617766],[-74.00503828107523,40.759185242193205],[-74.00365196250766,40.76078578631616],[-74.0029466621919,40.76145532566209],[-73.99442612485021,40.77338958506989],[-73.99404575033539,40.77391934091227],[-73.9915789804016,40.77290396036565],[-73.9899840177178,40.77223996387495],[-73.98702903907453,40.771020991659846],[-73.98432099160637,40.76981699774153],[-73.98197198119891,40.7688509579544],[-73.97245802531758,40.764856002535524],[-73.9694530080794,40.763581992803196],[-73.96612000132221,40.76217299385885],[-73.9638440310088,40.76116102848091],[-73.96151804433701,40.76021603832448],[-73.95924002963994,40.759268010798074],[-73.95754926445754,40.75853265287229]]]}}]}
        }
  	},
  	type: '',
	mapBoxLayers: [
        {
            id: 'hub_boundary',
            type: 'line',
            source: 'hub_bound',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': 'grey',
              'line-width': {
                base: 1.5,
                stops: [[3, 1], [13, 5], [18, 8]]
              },
            }
        },
        {
            'id': 'hub_bound_points',
            'type': 'line',
            'source': {
                'type': 'geojson',
                'data':  { "type": "FeatureCollection", "features": [] }
            }
        }
	],
	filters: {
        year: {
            name: 'Year',
            type: 'dropdown',
            domain: [2016,2017,2018],
            value: 2017
        },
        from: {
            name: 'From',
            type: 'dropdown',
            domain: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
            value: 12
        },
        to: {
            name: 'To',
            type: 'dropdown',
            domain: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
            value: 12
        },
        mode: {
            name: 'Mode',
            type: 'dropdown',
            domain: [
                {value:'9', name:'Bicycle'},
                {value:'5', name:'Express Bus'},
                {value:'4', name:'Local Bus'},
                {value:'8', name:'Private Ferry'},
                {value:'7', name:'Public Ferry'},
                {value:'3', name:'Rail Rapid Transit - Express'},
                {value:'2', name:'Rail Rapid Transit - Local'},
                {value:'1', name:'Suburban Rail'},
                {value:'10', name:'Tramway'},
                {value:'6', name:'Vehicles (Auto+Taxi+Trucks+Comm. Vans)'}
            ]
        },
        direction: {
            name: 'Direction',
            type: 'dropdown',
            domain: [
                'Inbound',
                'Outbound'
            ]
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
	return fetch(`/views/23/data_overlay`)
        .then(response => response.json())

    //https://tigtest.nymtc.org/views/23/data_overlay?utf8=%E2%9C%93&year=2015&hour=0&upper_hour=0&transit_mode=6&transit_direction=Outbound&lower=&upper=&commit=Filter
}


function receiveData ( data, map) {
    console.log('HUB BOUND recieveData', data,map)


    let variables = []
    let colors = data.symbologies[0].color_scheme.reduce( (out,curr) => {
        out[curr.value] = curr.color
        return out; 
    }, {})
    let hubData = data.data.reduce((out, curr) => {
        if(!out[curr.loc_id]){
            out[curr.loc_id] = {
              "type": "Feature",
              "properties": {
                id: curr.loc_id,
                name: curr.loc_name,
                sector: curr.sector_name,
                route: curr.route_name,
                mode: curr.mode_name,
                color: colors[curr.sector_name]
              },
              "geometry": {
                "type": "Point",
                "coordinates": [
                  curr.lng,
                  curr.lat
                ]
              }
            }
        }
        if(!out[curr.loc_id].properties[curr.var_name]){
            out[curr.loc_id].properties[curr.var_name] = []
        }
        if (variables.indexOf(curr.var_name) == -1 ) {
            variables.push(curr.var_name)
        }
        out[curr.loc_id].properties[curr.var_name].push({
            hour: curr.hour,
            count: +curr.count.replace(/,/g, '')
        })
        return out
    },{})

    let hubGeo = Object.keys(hubData).reduce((final, key) => {
        let feature = hubData[key]
        //console.log()
        variables.forEach(vname => {
            feature.properties[`${vname}_total`] = feature.properties[vname]
            .reduce((a,b) => {
                return a + +b.count
            },0)

            
        })
        feature.properties['Occupancy Rates_total'] /= feature.properties['Occupancy Rates'].length
        feature.properties['Occupancy Rates_total'] = feature.properties['Occupancy Rates_total'].toFixed(2)
        final.features.push(feature)
        return final
    }, { "type": "FeatureCollection", "features": [] })

    map.removeLayer('hub_bound_points')
    map.removeSource('hub_bound_points')
    map.addLayer({
        'id': 'hub_bound_points',
        'type': 'circle',
        'source': {
            'type': 'geojson',
            'data': hubGeo
        },
        paint: {
            'circle-radius': ['/',['number', ['get', 'Passengers_total']], 5000],
            'circle-opacity': 0.8,
            'circle-color': ['string', ['get', 'color']]
        }
    })

    let popUpOptopns = {
        rows: ['name','sector', 'route', 'mode', 'Occupancy Rates_total', 'Vehicles_total', 'Passengers_total']
    }

    addPopUp(map, 'hub_bound_points', popUpOptopns)
} 


export default hubLayer;
