import React from "react";
import styled from "styled-components";
import { Col, Row } from "react-bootstrap";
import autoBind from "react-autobind";
import Loading from "../../components/Loading/Loading";

const AccountGroupStyles = styled.div``;

class AccountGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: [],
      loading: true
    };
    autoBind(this);
  }

  componentDidMount() {
    Meteor.call("users.getGroupCount", (err, res) => {
      if (!err) {
        this.setState({ account: res, loading: false });
      } else {
        this.setState({ loading: false });
      }
    });
  }

  render() {
    const { account, loading } = this.state;

    return (
      <AccountGroupStyles>
        <Row>
          <Col md={8} mdOffset={2}>
            {!loading ? (
              account.length > 0 &&
              account.map(({ _id, count }, index) => {
                return (
                  <div key={index}>
                    <p>Account Type: {_id}</p>
                    <p>Number : {count}</p>
                    <hr />
                  </div>
                );
              })
            ) : (
              <Loading />
            )}
          </Col>
        </Row>
      </AccountGroupStyles>
    );
  }
}

export default AccountGroup;
