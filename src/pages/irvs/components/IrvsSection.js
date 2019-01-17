import React from "react"
import { connect } from "react-redux"

import { SECTION_META } from "./irvs_meta"

import IrvsSelect from "./IrvsSelect"

class IrvsSection extends React.Component {
	render() {
		const { section } = this.props;
		return(
			<div style={ { paddingBottom: "30px" } }>
					{
						SECTION_META[section].values.map(d => <IrvsSelect key={ d } option={ d }/>)
					}
			</div>
		)
	}
}

const mapStateToProps = state => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(IrvsSection)