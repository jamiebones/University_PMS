/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Grid, Alert, Button , Row , Col } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import Authenticated from '../../components/Authenticated/Authenticated';

if ( Meteor.isClient) import './LoginLayout.scss';

const LoginLayout = ({match , userId, ...rest}) => (
  
    <div className="loginLayout">
      <div className="loginLayoutContent">

        <div className="row">
           <div className="col-lg-12 col-md-12 col-sm-12">
           <div>
           <Switch>
            
         </Switch>
           </div>
         </div>
         </div>
         </div>
      </div>
     
)

export default LoginLayout;