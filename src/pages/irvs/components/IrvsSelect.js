import React from "react"
import { connect } from "react-redux"
import { reduxFalcor } from 'utils/redux-falcor';

import { updateIrvsData } from "store/modules/irvs"

import { getLabel } from "./irvs_meta"

class IrvsSelect extends React.Component {
	state = {
		name: "",
		options: []
	}
	fetchFalcorDeps() {
		return this.props.falcor.get(
			['irvs', 'meta', this.props.option, ['name', 'values']]
		)
		.then(res => {
			let name = "",
				options = [];
			try {
				const graph = res.json.irvs.meta[this.props.option];
				name = graph.name;
				options = graph.values;
			}
			catch (e) {
				name = "";
				options = [];
			}
			this.setState({ name, options })
		})
	}
	onChange(e) {
		this.props.updateIrvsData({ [this.props.option]: e.target.value })
	}
	render() {
		const { option, value } = this.props;
		return(
			<div className="row irvs-select">
				<div className="col-1" style={ { paddingTop: "5px" } }>
					{ getLabel(option) }
				</div>
				<div className="col-8" style={ { paddingTop: "5px" } }>
					{ this.state.name }
				</div>
				<div className="col-3">
					<select className="form-control form-control-sm"
						value={ value }
						onChange={ this.onChange.bind(this) }>
						<option value="" hidden>Make a selection...</option>
						{
							this.state.options.map(o =>
								<option key={ o } value={ o }>{ o }</option>
							)
						}
					</select>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state, props) => ({
	irvs: state.graph.irvs,
	value: state.irvs.data[props.option] || ""
})

const mapDispatchToProps = {
	updateIrvsData
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(IrvsSelect))