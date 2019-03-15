/*eslint-disable */
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import Authorized from "../../components/Authorized/Authorized";
import AddStaffDocuments from "../../pages/AddStaffDocuments/AddStaffDocuments";
import StaffPosting from "../../pages/StaffPostingPage/StaffPostingPage";
import StaffPostingTab from "../../pages/StaffPostingTab/StaffPostingTab";
import NotFound from "../../pages/NotFound/NotFound";

const AuthorizedLayout = ({ match, userId, ...rest }) => (
  <div className="loginLayout">
    <Row>
      <Col md={12}>
        <div>
          <Switch>
            <Authorized
              allowedRoles={["manage-site", "edit-content", "super-admin"]}
              group="canEditRecords"
              userId={userId}
              exact
              path={`${match.path}/add_staff_documents`}
              component={AddStaffDocuments}
              {...rest}
            />

            <Authorized
              allowedRoles={["manage-site", "edit-content", "super-admin"]}
              group="canEditRecords"
              userId={userId}
              exact
              path={`${match.path}/propose_staff_posting`}
              component={StaffPosting}
              {...rest}
            />

            <Authorized
              allowedRoles={["manage-site", "edit-content", "super-admin"]}
              group="canEditRecords"
              userId={userId}
              exact
              path={`${match.path}/staff_posting`}
              component={StaffPostingTab}
              {...rest}
            />

            <Route component={NotFound} />
          </Switch>
        </div>
      </Col>
    </Row>
  </div>
);

export default AuthorizedLayout;
