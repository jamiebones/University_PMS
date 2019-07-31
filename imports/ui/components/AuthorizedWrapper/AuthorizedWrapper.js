
/* eslint-disable */

import React from 'react';
import { Row, Col } from 'react-bootstrap';
import styled from 'styled-components';

const AuthStyle = styled.div`

`




class AuthorizedWrapper extends React.Component{
    render(){
        return (
            <AuthStyle>
            
            <Row>
                <Col md={3}>
                    
                </Col>

                <Col md={9}>
                    
                    {this.props.children}
                    
                </Col>
            </Row>
            </AuthStyle>
        )
    }
}



export default AuthorizedWrapper;