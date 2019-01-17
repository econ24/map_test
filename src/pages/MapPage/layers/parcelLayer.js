import React from "react"

import store from "store"
import { falcorGraph } from "store/falcorGraph"
import { update } from "utils/redux-falcor/components/duck"

import MapLayer from "../AvlMap/MapLayer"

import {
    scaleQuantile,
    scaleOrdinal,
    scaleQuantize
} from "d3-scale"

import { fnum } from "utils/sheldusUtils"

import COLOR_RANGES from "constants/color-ranges"

import ParcelLayerModal from "./modals/ParcelLayerModal"

export const MEASURES = [
    { value: "full_marke", name: "Full Market Value" },
    { value: "prop_class", name: "Property Type" },
    { value: "owner_type", name: "Owner Type" }
]
export const getMeasureLabel = value =>
    MEASURES.reduce((a, c) => c.value === value ? c.name : a, value);
export const getMeasureFormat = (measure, value) => {
    switch (measure) {
        case "prop_class":
            value = +value;
            if (value < 100) return "Unknown"
            if (value < 200) return "Agricultural"
            if (value < 300) return "Residential"
            if (value < 400) return "Vacant Land"
            if (value < 500) return "Commercial"
            if (value < 600) return "Recreation & Entertainment"
            if (value < 700) return "Community Services"
            if (value < 800) return "Industrial"
            if (value < 900) return "Public Services"
            return "Wild, Forested, Conservation Lands & Public Parks"
        case "owner_type":
            const map = {
                "1": "Federal",
                "2": "State",
                "3": "County",
                "4": "City",
                "5": "Town",
                "6": "Village",
                "7": "Mixed Gov’t",
                "8": "Private",
                "9": "Public School District or BOCES",
                "10": "Road Right of Way",
                "-999": "Unknown",
            }
            return map[value];
        default:
            return `$${ fnum(value) }`;
    }
}
const QUANTILE_RANGE = COLOR_RANGES[5].reduce((a, c) => c.name === "RdYlBu" ? c.colors : a)
const NON_ORDINAL_LEGEND = {
  type: "quantile",
  types: ["quantile", "quantize"],
  format: getMeasureFormat.bind(null, "full_marke"),
  vertical: false,
  range: QUANTILE_RANGE
}

class ParcelLayer extends MapLayer {
  onAdd(map) {
    super.onAdd(map)

    this.loading = true;

    const geoLevel = "cousubs";
    falcorGraph.get(["geo", "36", geoLevel])
      .then(res => res.json.geo['36'][geoLevel])
      .then(geoids => {
        const requests = [],
            num = 500;
        for (let i = 0; i < geoids.length; i += num) {
          requests.push(geoids.slice(i, i + num))
        }
        return requests.reduce((a, c) => a.then(() => falcorGraph.get(["geo", c, "name"])), Promise.resolve())
          .then(() => {
            const graph = falcorGraph.getCache().geo;
            parcelLayer.filters.area.domain = geoids.map(geoid => {
              return { value: geoid, name: graph[geoid].name }
            })
            .sort((a, b) => {
              const aCounty = a.value.slice(0, 5),
                bCounty = b.value.slice(0, 5);
              if (aCounty === bCounty) {
                return a.name < b.name ? -1 : 1;
              }
              return +aCounty - +bCounty;
            })
          })
      })
      .then(() => store.dispatch(update(falcorGraph.getCache())))
      .then(() => this.component.forceUpdate())

    falcorGraph.get(["parcel", "byGeoid", '3600101000', "length"])
      .then(res => res.json.parcel.byGeoid['3600101000'].length)
      .then(length => falcorGraph.get(["parcel", "byGeoid", "3600101000", "byIndex", { from: 0, to: length }, "id"]))
      .then(() => this.component.updateFilter('Parcel Layer', 'area', ['3600101000']))
  }
  onFilterFetch(filterName, oldValue, newValue) {
    if (filterName === "measure") {
      this.onMeasureChange(oldValue, newValue);
    }
    const geoids = this.filters.area.value;
    if (!geoids.length) {
      return Promise.resolve({ parcelids: [] });
    }
    return falcorGraph.get(["parcel", "byGeoid", geoids, "length"])
      .then(res => {
        let max = -Infinity;
        geoids.forEach(geoid => {
          const length = res.json.parcel.byGeoid[geoid].length;
          max = Math.max(length, max);
        })
        return max;
      })
      .then(length => {
        return falcorGraph.get(["parcel", "byGeoid", geoids, "byIndex", { from: 0, to: length }, "id"])
          .then(res => {
            const parcelids = [];
            geoids.forEach(geoid => {
              const graph = res.json.parcel.byGeoid[geoid].byIndex;
              for (let i = 0; i < length; ++i) {
                if (graph[i]) {
                  parcelids.push(graph[i].id)
                }
              }
            })
            return parcelids;
          })
      })
      .then(parcelids => {
        const requests = [],
          num = 500;
        for (let i = 0; i < parcelids.length; i += num) {
          requests.push(parcelids.slice(i, i + num))
        }
        return requests.reduce((a, c) => a.then(() => falcorGraph.get(["parcel", "byId", c, MEASURES.map(m => m.value)])), Promise.resolve())
          .then(() => {
            const measure = parcelLayer.filters.measure.value;
            let colors = {};
            if (measure === "full_marke") {
              colors = this.processNonOrdinal(parcelids);
            }
            else {
              colors = this.processOrdinal(parcelids);
            }
            return { colors, parcelids };
          })
      })
  }
  onLegendChange() {
    return this.onFilterFetch();
  }
  receiveData(map, { colors, parcelids }) {
    if (!parcelids.length) {
      map.setFilter('nys_1811_parcels', ["!in", "OBJECTID", "none"])
      map.setPaintProperty('nys_1811_parcels', 'fill-color', 'rgba(0,0,196,0.1)');
      this.legend.active = false;
      return;
    }
    map.setFilter('nys_1811_parcels', ["in", "OBJECTID", ...parcelids.map(d => +d)])
    map.setPaintProperty('nys_1811_parcels', 'fill-color', ["get", ["to-string", ["get", "OBJECTID"]], ["literal", colors]]);
    this.legend.active = true;
  }

  onMeasureChange(oldValue, newValue) {
    if (oldValue !== newValue) {
      switch (newValue) {
        case "full_marke":
          this.legend = {
            ...this.legend,
            ...NON_ORDINAL_LEGEND
          }
          break;
        default:
        this.legend = {
          ...this.legend,
          type: "ordinal",
          types: ["ordinal"],
          format: getMeasureFormat.bind(null, newValue),
          vertical: true
        }
      }
    }
  }

  processNonOrdinal(parcelids) {
    const measure = this.filters.measure.value,
      graph = falcorGraph.getCache().parcel.byId,

      values = {},
      colors = {},

      domain = [];

    let min = Infinity,
      max = -Infinity,

      scale;

    parcelids.forEach(pid => {
      const value = graph[pid][measure];
      values[pid] = value;
      domain.push(value);
      min = Math.min(min, value);
      max = Math.max(max, value);
    })

    const type = this.legend.type,
        range = this.legend.range;
    switch (type) {
      case "quantile":
        scale = scaleQuantile()
          .domain(domain)
          .range(range);
        this.legend.domain = domain;
        break;
      case "quantize":
        scale = scaleQuantize()
          .domain([min, max])
          .range(range);
        this.legend.domain = [min, max];
        break;
    }

    for (const pid in values) {
      colors[pid] = scale(values[pid])
    }
    return colors
  }

  processOrdinal(parcelids) {
    const measure = this.filters.measure.value,
      graph = falcorGraph.getCache().parcel.byId,

      values = {},
      colors = {},

      domainMap = {},

      scale = scaleOrdinal();

    parcelids.forEach(pid => {
      let value = graph[pid][measure];
      if (value) {
        if (measure === "prop_class") {
          value = +(graph[pid][measure].toString()[0]) * 100;
        }
        values[pid] = value;
        domainMap[value] = true;
      }
    })

    const domain = Object.keys(domainMap);

    let range = this.legend.range;
    if (range.length !== domain.length) {
      range = COLOR_RANGES[domain.length].reduce((a, c) => c.type === "qualitative" ? c.colors : a);
    }

    scale.domain(domain)
      .range(range);

    this.legend.domain = domain;
    this.legend.range = range;

    for (const pid in values) {
      colors[pid] = scale(values[pid])
    }
    return colors
  }
}

const parcelLayer = new ParcelLayer("Parcel Layer", {
  sources: [
    { id: "nys_parcels",
      source: {
        'type': "vector",
        'url': 'mapbox://am3081.6o6ny609'
      }
    }
  ],
  layers: [
    { 'id': 'nys_1811_parcels',
      'source': 'nys_parcels',
      'source-layer': 'nys_1811_parcels',
      'minzoom': 10,
      'type': 'fill',
      'paint': {
          'fill-color': 'rgba(0,0,196,0.1)',
      }
    }
  ],
  modal: {
    comp: () => <ParcelLayerModal geoids={ parcelLayer.filters.area.value }/>,
    show: false,
    controlButton: true
  },
  filters: {
    area: {
      name: 'Area',
      type: 'multi',
      domain: [],
      value: []
    },
    measure: {
      name: "Measure",
      type: "dropdown",
      domain: MEASURES,
      value: "full_marke"
    }
  },
  legend: {
    ...NON_ORDINAL_LEGEND,

    active: true,
    domain: [],
    title: "Parcel Legend"
  },
  popover: {
    layers: ["nys_1811_parcels"],
    dataFunc: feature => {
      const id = feature.properties.OBJECTID;
      try {
        const graph = falcorGraph.getCache().parcel.byId;
        return [
            "PARCEL DATA",
            [getMeasureLabel("full_marke"), getMeasureFormat("full_marke", graph[id]["full_marke"])],
            [getMeasureLabel("prop_class"), getMeasureFormat("prop_class", graph[id]["prop_class"])],
            [getMeasureLabel("owner_type"), getMeasureFormat("owner_type", graph[id]["owner_type"])]
        ]
      }
      catch (e) {
        return []
      }
    }
  }
})

export default parcelLayer