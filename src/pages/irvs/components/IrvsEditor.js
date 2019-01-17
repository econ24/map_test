import React from "react"
import { connect } from "react-redux"

import IrvsHeader from "./IrvsHeader"
import IrvsSection from "./IrvsSection"

import { SECTION_META } from "./irvs_meta"

import "./irvs.css"

class IrvsEditor extends React.Component {
	state = {
		section: 0
	}
	selectSection(section) {
		this.setState({ section })
	}
	advanceSection(dir) {
		this.setState({ section: Math.max(0, Math.min(this.state.section + dir, SECTION_META.length - 1)) })
	}
	render() {
		const { section } = this.state;
		return(
      <div className="row">
      	<div className="col-12">
					<IrvsHeader section={ section }
						select={ this.selectSection.bind(this) }
						advance={ this.advanceSection.bind(this) }/>
				</div>
        <div className="col-2"/>
        <div className="col-8">
        	<IrvsSection section={ section }/>
        </div>
      </div>
		)
	}
}

const mapStateToProps = state => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(IrvsEditor)