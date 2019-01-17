import React from "react"
import { connect } from "react-redux"

import styled from 'styled-components';
import {
    PanelHeaderTitle,
    PanelContent
} from "components/common/styled-components"
import {
    ArrowDown,
    ArrowRight
} from "components/common/icons"

import store from "store"
import {
    toggleModal,
    toggleInfoBox
} from "pages/MapView/store/MapStore"

import { addLayers, removeLayers, toggleVisibility } from 'pages/MapView/layers/utils'

const ModalContainer = PanelContent.extend`
    padding: 20px;
`
const ModalHeaderTitle = PanelHeaderTitle.extend`
    font-size: 24px;
    border-bottom: 2px solid ${ props => props.theme.textColorHl };
    color: ${ props => props.theme.textColorHl };
`
const ModalContent = styled.div`
    color: ${ props => props.theme.textColor };
`

class BuildingsModal extends React.Component {
    render() {
        const { theme } = this.props,
            style = {
                backgroundColor: theme.sidePanelHeaderBg,
                color: theme.textColor
            }
        return (
            <ModalContainer>
                <ModalHeaderTitle>
                    Testing Modal!!!
                </ModalHeaderTitle>
                <div style={ { height: "10px" } }/>
                <ModalContent>
                    STUFF GOES HERE!!!
                </ModalContent>
            </ModalContainer>
        )
    }
}
// //
const mapStateToProps = state => ({
    theme: state.map.theme
})
const mapDispatchToProps = {}
const Connected = connect(mapStateToProps, mapDispatchToProps)(BuildingsModal)

const InfoBox = ({}) =>
    <div style={ { padding: "10px", fontSize: "24px" } }>
        Buildings Layer Test Info Box
    </div>

const buildingsLayer = {
	name: 'NYS Buildings',
    type: 'buildings',
	loading: false,
    visible: true,
	mapBoxSources: {
        buildings: {
    		type: 'vector',
    		url: 'mapbox://am3081.5ki8tlog'
        },  
    },
	mapBoxLayers: [
	   {
            'id': 'buildings_layer',
            'source': 'buildings',
            'source-layer': 'NewYork',
            'type': 'fill',
            'paint': {
                'fill-color': 'rgba(196, 0, 0, 0.1)',
            }
        }
    ],
	onAdd: addLayers,
	onRemove: removeLayers,
    toggleVisibility,
	active: false,
    modal: {
        comp: Connected,
        show: false,
        controlButton: false
    },
    infoBoxes: {
        test: {
            comp: InfoBox,
            show: false
        }
    },
    actions: [
        {
            Icon: ArrowDown,
            action: () => store.dispatch(toggleModal("buildingsLayer")),
            tooltip: "Open Modal"
        },
        {
            Icon: ArrowRight,
            action: () => store.dispatch(toggleInfoBox("buildingsLayer", "test")),
            tooltip: "Open Info Box"
        }
    ]
}

export default buildingsLayer