import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch } from 'react-router-dom';

import { login } from './store/modules/user';

import { auth } from './store/modules/user';
// comp
import Layout from './layouts/Layout'
import Routes from './routes'

import { ThemeProvider }  from 'styled-components';
import theme from 'components/common/themes/dark'

import './App.css';

import Messages from "./components/messages"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isAuthenticating: true
    }
  }

  componentWillMount() {
    this.props.auth();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.user.attempts) {
      this.setState({ isAuthenticating: false });
    }
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <div className="all-wrapper solid-bg-all">
          <Switch>
          {
          	Routes.map((route,i) => {
              return (
    	    			<Layout
                  key = {i}
                  { ...route }
                  isAuthenticating = { this.state.isAuthenticating }
                  authed = { this.props.user.authed }
                  router = {this.props.router}
                  user = {this.props.user}
                  menuSettings = { route.menuSettings ?  route.menuSettings  : {} }
                  routes={route.routes}
    	    				menus = { Routes } 
                  breadcrumbs = {route.breadcrumbs}
    	    			/>
    	    		)
  	    	  }) 
          }
          </Switch>
          <Messages />
        </div>
      </ThemeProvider>
    );
  }
}



const mapStateToProps = state => {
  return {
    user: state.user,
    router: state.router
  };
};
 
export default connect(mapStateToProps, { auth })(App);
