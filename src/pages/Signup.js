import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';

import { signup } from '../store/modules/user';

import Logo from "components/mitigate-ny/Logo"

import './Login.css'

class Login extends Component {
  state = {
      email: '',
      email_verify: ''
  }
  
  validateForm() {
    return this.state.email.length > 0 && this.state.email === this.state.email_verify;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSubmit = async event => {
    event.preventDefault();
    this.props.signup(this.state.email);
  };

  render () {

    return (

      	<div className="auth-box-w">
  		  <div className="logo-w">
  		    <Logo width="300"/>
  		  </div>
  		  <h4 className="auth-header">Signup</h4>
  		  <form onSubmit={this.handleSubmit}>
  		    <div className="form-group">
  		      <label htmlFor=''>Email</label>
  		      <input
              id="email"
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
              className="login-form-control"
              placeholder="Enter your email"
              required
            />
  		      <div className="pre-icon os-icon os-icon-user-male-circle" />
  		    </div>
  		    <div className="form-group">
  		      <label htmlFor=''>Verify Email</label>
            <input
              id="email_verify"
              type="email"
              value={this.state.email_verify}
              onChange={this.handleChange}
              className="login-form-control"
              placeholder="Verify your email"
            />
  		      <div className="pre-icon os-icon os-icon-fingerprint" />
  		    </div>
  		    <div className="buttons-w">
  		      <button className="btn btn-primary btn-lg btn-block" disabled={!this.validateForm()}>Sign me up</button>
  		    </div>
  		  </form>
  		</div>
     
    )
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = { signup };
 
export default
{
  icon: 'icon-map',
  path: '/signup',
  mainNav: false,
  component: connect(mapStateToProps, mapDispatchToProps)(Login),
  menuSettings: {image: 'none', 'scheme': 'color-scheme-light'}
}

  