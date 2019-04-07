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
import DashBoard from "../../pages/DashBoard/DashBoard";
import NotFound from "../../pages/NotFound/NotFound";
import SearchStaffRecords from "../../pages/SearchStaffRecords/SearchStaffRecords";
import StaffDetailsPage from "../../pages/StaffDetailsPage/StaffDetailsPage";
import AddCadrePage from "../../pages/AddCadres/AddCadres";
import StaffProposePostingPage from "../../pages/StaffProposePostingPage/StaffProposePostingPage";
import PensionDashboard from "../../pages/PensionDashboard/PensionDashboard";
import StaffPromotion from "../../pages/StaffPromotion/StaffPromotion";
import HomePageDashboard from "../../pages/HomePageDashboard/HomePageDashboard";

const AuthorizedLayout = ({ match, userId, ...rest }) => (
  <div className="loginLayout">
    <Row>
      <Col md={12}>
        <div>
          <Switch>
            <Authorized
              allowedRoles={["SATS", "Records", "ASE", "JSE", "super-admin"]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/add_staff_documents`}
              component={AddStaffDocuments}
              {...rest}
            />

            <Authorized
              allowedRoles={[
                "SATS",
                "Records",
                "ASE",
                "Director",
                "JSE",
                "super-admin"
              ]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/staff_posting`}
              component={StaffPostingTab}
              {...rest}
            />

            <Authorized
              allowedRoles={[
                "SATS",
                "Records",
                "ASE",
                "Director",
                "JSE",
                "super-admin"
              ]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/due_for_promotion`}
              component={StaffPromotion}
              {...rest}
            />

            <Authorized
              allowedRoles={["Records", "Pensions", "super-admin"]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/dashboard/pensions/home`}
              component={PensionDashboard}
              {...rest}
            />

            <Authorized
              allowedRoles={["Registrar", "super-admin"]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/registrar/staff_posting`}
              component={RegistrarViewPosting}
              pathAfterFailure="/logout"
              {...rest}
            />

            <Authorized
              allowedRoles={["SATS", "Records", "ASE", "JSE", "super-admin"]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/posting_list`}
              component={ApprovedPostingList}
              {...rest}
            />

            <Authorized
              allowedRoles={["SATS", "Records", "ASE", "JSE", "super-admin"]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/dashboard/home`}
              component={DashBoard}
              {...rest}
            />

            <Authorized
              allowedRoles={["SATS", "Records", "ASE", "JSE", "super-admin"]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/records/search`}
              component={SearchStaffRecords}
              {...rest}
            />

            <Authorized
              allowedRoles={["SATS", "Records", "ASE", "JSE", "super-admin"]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/record/:staffId`}
              component={StaffDetailsPage}
              {...rest}
            />

            <Authorized
              allowedRoles={["SATS", "Records", "ASE", "JSE", "super-admin"]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/add_cadre`}
              component={AddCadrePage}
              {...rest}
            />

            <Authorized
              allowedRoles={["SATS", "Records", "ASE", "JSE", "super-admin"]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/propose_posting`}
              component={StaffProposePostingPage}
              {...rest}
            />

            <Authorized
              allowedRoles={[
                "SATS",
                "Records",
                "ASE",
                "JSE",
                "Registrar",
                "super-admin"
              ]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/dashboard`}
              component={HomePageDashboard}
              pathAfterFailure="/logout"
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
