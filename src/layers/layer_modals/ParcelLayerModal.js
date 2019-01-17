import React from "react"
import { connect } from "react-redux"
import { reduxFalcor } from "utils/redux-falcor"

import styled from 'styled-components';

import TableBox from "components/light-admin/tables/TableBox"

import {
	MEASURES,
	getMeasureLabel,
	getMeasureFormat
} from "../parcelLayer"

const ModalContainer = styled.div`
	background-color: ${ props => props.theme.panelBackground };
	padding: 20px;
`
const ModalHeader = styled.div`
	color: ${ props => props.theme.textColorHl };
	font-size: 24px;
	font-weight: bold;
	margin-bottom: 20px;
`

class ParcelLayerModal extends React.Component {
	processData() {
		let data = [];
		try {
			const parcelIds = [];
			this.props.geoids.forEach(geoid => {
				const graph = this.props.parcelGraph.byGeoid[geoid];
				for (let i = 0; i < graph.length; ++i) {
					parcelIds.push(graph.byIndex[i].id)
				}
			})
			parcelIds.forEach(id => {
				const graph = this.props.parcelGraph.byId[id];
				const row = {
					"Parcel ID": id,
					[getMeasureLabel("full_marke")]: +graph["full_marke"],
					[getMeasureLabel("prop_class")]: getMeasureFormat("prop_class", graph["prop_class"]),
					[getMeasureLabel("owner_type")]: getMeasureFormat("owner_type", graph["owner_type"])
				}
				data.push(row);
			})
		}
		catch (e) {
			data = [];
		}
		return data.sort((a, b) => b[getMeasureLabel("full_marke")] - a[getMeasureLabel("full_marke")])
	}
	render() {
		const formats = {
			[getMeasureLabel("full_marke")]: getMeasureFormat.bind(null, "full_marke")
		}
		return (
			<ModalContainer>
				<ModalHeader>
					PARCEL DATA
				</ModalHeader>
				<TableBox pageSize={ 5 }
					data={ this.processData() }
					columnFormats={ formats }/>
			</ModalContainer>
		)
	}
}

const mapStateToProps = state => ({
	geoids: state.map.layers["parcelLayer"].filters.area.value,
	update: state.map.update,
	geoGraph: state.graph.geo,
	parcelGraph: state.graph.parcel
})
const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(ParcelLayerModal))