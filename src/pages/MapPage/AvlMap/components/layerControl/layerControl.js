import React, {Component} from 'react';
import { connect } from 'react-redux';

import styled from 'styled-components';
import {
  PanelLabel,
  StyledPanelDropdown,
  Button
} from 'components/common/styled-components';

import LayerHeader from './layerHeader'
import LayerFilterPanel from './layerFilterPanel'

import LegendSelector from "./legendSelector"

// import deepEqual from 'deep-equal'

const StyledFilterPanel = styled.div`
  margin-bottom: 12px;
  border-radius: 1px;
  padding-left: 12px;
  padding-right: 12px;
  width: 100%;
`;

const ModalToggle = ({ layer, toggle }) =>
  <StyledFilterPanel>
    <Button onClick={ toggle } secondary={ true } small={ true } width={ "100%" }>
      { layer.modal.show ? "Hide" : "Show" } Modal
    </Button>
  </StyledFilterPanel>

 class LayerControl extends Component {
  state = {
    showConfig: true
  }

  onDragStart(e, layerName, index) {
    this.props.updateDrag({ dragging: layerName })
  }
  onDragOver(e, index) {
    e.preventDefault()
    this.props.updateDrag({ dragover: index })
  }
  
  render() {
    const { layer, theme, actionMap, index } = this.props
    let LayerControlStyle = {
      width: '100%',
      display: 'flex',
      marginBottom: 5,
      backgroundColor: theme.sidePanelHeaderBg
    }

    const { showConfig } = this.state;

    const removeLayer = () => {
      this.props.removeLayer(layer.name)
    }

    const toggleConfig = () => {
      this.setState({showConfig: !this.state.showConfig})
    }

    const toggleVisibility = () => {
      this.props.toggleLayerVisibility(layer.name)
    }

    return (
      <div draggable={ true }
        onDragStart={ e => this.onDragStart(e, layer.name, index) }
        onDragOver={ e => this.onDragOver(e, index) }>
        <div className='active-layer-container' style={LayerControlStyle}>
          <LayerHeader layer={ layer }
            onRemoveLayer={ removeLayer }
            onToggleVisibility={ toggleVisibility }
            isVisible={ layer.visible }
            onToggleEnableConfig={ toggleConfig }
            actionMap={ actionMap }/>
        </div>
        { !showConfig || !layer.modal || !layer.modal.controlButton ? null :
          <ModalToggle layer={ layer }
            toggle={ e => this.props.toggleModal(layer.name) }/>
        }
        { !showConfig || !layer.legend || !layer.legend.active ? null :
          <LegendSelector layer={ layer }
            updateLegend={ this.props.updateLegend }/>
        }
        { !showConfig || !layer.filters ? null :
          <LayerFilterPanel layer={ layer }
            updateFilter={ this.props.updateFilter }/>
        }
      </div>
    );
  }
}

export default LayerControl