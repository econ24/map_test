import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Element from 'components/light-admin/containers/Element'
import ElementBox from 'components/light-admin/containers/ElementBox'
import Content from 'components/cms/Content'

class Home extends Component {
  render () {
   return (
     <div>
       <Element>
          <h6 className="element-header">NPMRDS</h6>
          <div className='row'>
            <div className='col-6'>
              <Link to='/incidents'>
                <ElementBox style={{height: '25vh', textAlign:'center', paddingTop: '14%'}}>
                  <h4 style={{color:'#047bf8'}}>Incidents</h4>
                </ElementBox>
              </Link>
            </div>
            <div className='col-6'>
              <ElementBox style={{height: '25vh', textAlign:'center', paddingTop: '14%'}}>
                <h4 style={{color:'#ddd'}}></h4>
              </ElementBox>
            </div>
          </div>
          <div className='row'>
            <div className='col-6'>
               <ElementBox style={{height: '25vh', textAlign:'center', paddingTop: '14%'}}>
                <h4 style={{color:'#ddd'}}></h4>
              </ElementBox>
            </div>
            <div className='col-6' >
               <ElementBox style={{height: '25vh', textAlign:'center', paddingTop: '14%'}}>
                <h4 style={{color:'#ddd'}}></h4>
              </ElementBox>
            </div>
          </div>
        </Element>     
     </div>
    )
  }
}

export default {
	icon: 'os-icon-home',
	path: '/',
	exact: true,
	mainNav: true,
  menuSettings: {
    image: 'none',
    scheme: 'color-scheme-dark', 
    position: 'menu-position-left',
    layout: 'menu-layout-mini',
    style: 'color-style-default'  
  },
  name: 'Home',
	auth: false,
	component: Home
}