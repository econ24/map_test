import React from "react"
import { connect } from "react-redux"

import { SECTION_META } from "./irvs_meta"

const HeaderSection = ({ name, active, select }) =>
	<div style={ { display: "inline-block", padding: "5px 10px", cursor: "pointer", margin: "0px 2px" } }
		onClick={ select }>
		{ active ?
			<h4>{ name }</h4>
			: <h6>{ name }</h6>
		}
	</div>

const Button = ({ onClick, children }) =>
	<button className="btn btn-sm btn-primary" onClick={ onClick } style={ { width: "100px" } }>
		{ children }
	</button>

class IrvsOption extends React.Component {
	render() {
		const { section } = this.props;
		return(
			<div style={ { paddingTop: "20px" } }>
				<div style={ { display: "flex", justifyContent: "center" } }>
					<div>
						{ SECTION_META.map((s, i) =>
							<HeaderSection key={ s.name }
								name={ s.name }
								active={ section === i }
								select={ e => this.props.select(i) }/>)
						}
					</div>
				</div>
				<div style={ { height: "35px" } }>
					<div style={ { float: "left", marginLeft: "15%" } }>
						<Button onClick={ e => this.props.advance(-1) }>
							Back
						</Button>
					</div>
					<div style={ { float: "right", marginRight: "15%" } }>
						<Button onClick={ e => this.props.advance(1) }>
							Next
						</Button>
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = state => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(IrvsOption)