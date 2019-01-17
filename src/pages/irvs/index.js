import React, {Component} from 'react';
import { connect } from 'react-redux';

import IrvsEditor from "./components/IrvsEditor"

class IrvsContainer extends Component {
  render() {
    return (
      <div className="container">
        <IrvsEditor />
      </div>
    );
  }
}

const mapDispatchToProps = {
};

const mapStateToProps = state => ({
});

export default {
	icon: 'os-icon-map',
	path: '/irvs',
  auth: true,
	exact: true,
	mainNav: true,
  menuSettings: {
    image: 'none',
    scheme: 'color-scheme-light' 
  },
  name: 'IRVS Editor',
	component: connect(mapStateToProps, mapDispatchToProps)(IrvsContainer)
}