/*eslint-disable */
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import Authorized from "../../components/Authorized/Authorized";
import AddStaffDocuments from "../../pages/AddStaffDocuments/AddStaffDocuments";
import StaffPosting from "../../pages/StaffPostingPage/StaffPostingPage";
import StaffPostingTab from "../../pages/StaffPostingTab/StaffPostingTab";
import RegistrarViewPosting from "../../pages/RegistrarViewPosting/RegistrarViewPosting";
import ApprovedPostingList from "../../components/ApprovedPostingList/ApprovedPostingList";
import HomePageRegistrar from "../../pages/HomePageRegistrar/HomePageRegistrar";
import NotFound from "../../pages/NotFound/NotFound";
import SearchStaffRecords from "../../pages/SearchStaffRecords/SearchStaffRecords";
import StaffDetailsPage from "../../pages/StaffDetailsPage/StaffDetailsPage";
import AddCadrePage from "../../pages/AddCadres/AddCadres";
import StaffProposePostingPage from "../../pages/StaffProposePostingPage/StaffProposePostingPage";

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
              path={`${match.path}/staff_posting`}
              component={StaffPostingTab}
              {...rest}
            />

            <Authorized
              allowedRoles={["manage-site", "edit-content", "super-admin"]}
              group="canEditRecords"
              userId={userId}
              exact
              path={`${match.path}/registrar/staff_posting`}
              component={RegistrarViewPosting}
              {...rest}
            />

            <Authorized
              allowedRoles={["manage-site", "edit-content", "super-admin"]}
              group="canEditRecords"
              userId={userId}
              exact
              path={`${match.path}/posting_list`}
              component={ApprovedPostingList}
              {...rest}
            />

            <Authorized
              allowedRoles={["manage-site", "edit-content", "super-admin"]}
              group="canEditRecords"
              userId={userId}
              exact
              path={`${match.path}/registrar/home`}
              component={HomePageRegistrar}
              {...rest}
            />

            <Authorized
              allowedRoles={["manage-site", "edit-content", "super-admin"]}
              group="canEditRecords"
              userId={userId}
              exact
              path={`${match.path}/records/search`}
              component={SearchStaffRecords}
              {...rest}
            />

            <Authorized
              allowedRoles={["manage-site", "edit-content", "super-admin"]}
              group="canEditRecords"
              userId={userId}
              exact
              path={`${match.path}/record/:staffId`}
              component={StaffDetailsPage}
              {...rest}
            />

            <Authorized
              allowedRoles={["manage-site", "edit-content", "super-admin"]}
              group="canEditRecords"
              userId={userId}
              exact
              path={`${match.path}/add_cadre`}
              component={AddCadrePage}
              {...rest}
            />

            <Authorized
              allowedRoles={["manage-site", "edit-content", "super-admin"]}
              group="canEditRecords"
              userId={userId}
              exact
              path={`${match.path}/propose_posting`}
              component={StaffProposePostingPage}
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
