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
import StaffNominalRoll from "../../pages/StaffNominalRoll/StaffNominalRoll";
import StaffPostingStats from "../../pages/StaffPostingStats/StaffPostingStats";
import ViewStaffDocuments from "../../components/PdfViewer/PdfViewer";
import AdminAccountPage from "../../pages/AdminAccountPage/AdminAccountPage";
import UserStatus from "../../pages/UserStatus/UserStatus";
import Profile from "../../pages/Profile/Profile";

const AuthorizedLayout = ({ match, userId, ...rest }) => (
  <div className="loginLayout">
    <Row>
      <Col md={12}>
        <div>
          <Switch>
            <Authorized
              allowedRoles={["super-admin"]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/account_creation`}
              component={AdminAccountPage}
              pathAfterFailure="/logout"
              {...rest}
            />

            <Authorized
              allowedRoles={["super-admin"]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/account_status`}
              component={UserStatus}
              pathAfterFailure="/logout"
              {...rest}
            />

            <Authorized
              allowedRoles={["Records"]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/add_staff_documents`}
              pathAfterFailure="/logout"
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
                "super-admin",
                "Registrar"
              ]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/staff_posting`}
              component={StaffPostingTab}
              pathAfterFailure="/logout"
              {...rest}
            />

            <Authorized
              allowedRoles={[
                "SATS",
                "Records",
                "ASE",
                "Director",
                "JSE",
                "super-admin",
                "Registrar"
              ]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/profile`}
              component={Profile}
              pathAfterFailure="/logout"
              {...rest}
            />

            <Authorized
              allowedRoles={[
                "SATS",
                "Director",
                "JSE",
                "Registrar",
                "super-admin"
              ]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/posting_stats`}
              component={StaffPostingStats}
              pathAfterFailure="/logout"
              {...rest}
            />

            <Authorized
              allowedRoles={[
                "SATS",
                "Records",
                "ASE",
                "Director",
                "JSE",
                "super-admin",
                "Registrar"
              ]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/nominal_roll`}
              component={StaffNominalRoll}
              pathAfterFailure="/logout"
              {...rest}
            />

            <Authorized
              allowedRoles={[
                "SATS",
                "Records",
                "ASE",
                "Director",
                "JSE",
                "super-admin",
                "Registrar"
              ]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/due_for_promotion`}
              component={StaffPromotion}
              pathAfterFailure="/logout"
              {...rest}
            />

            <Authorized
              allowedRoles={["Records", "Pensions", "super-admin"]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/dashboard/pensions/home`}
              component={PensionDashboard}
              pathAfterFailure="/logout"
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
              allowedRoles={[
                "SATS",
                "Records",
                "Registrar",
                "Director",
                "JSE",
                "super-admin"
              ]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/posting_list`}
              component={ApprovedPostingList}
              pathAfterFailure="/logout"
              {...rest}
            />

            <Authorized
              allowedRoles={[
                "SATS",
                "Director",
                "Records",
                "Registrar",
                "ASE",
                "JSE",
                "super-admin"
              ]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/dashboard/home`}
              component={DashBoard}
              pathAfterFailure="/logout"
              {...rest}
            />

            <Authorized
              allowedRoles={[
                "SATS",
                "Records",
                "Registrar",
                "Director",
                "ASE",
                "JSE",
                "super-admin"
              ]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/records/search`}
              component={SearchStaffRecords}
              pathAfterFailure="/logout"
              {...rest}
            />

            <Authorized
              allowedRoles={[
                "SATS",
                "Records",
                "Director",
                "Registrar",
                "ASE",
                "JSE",
                "super-admin"
              ]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/record/:staffId`}
              component={StaffDetailsPage}
              pathAfterFailure="/logout"
              {...rest}
            />

            <Authorized
              allowedRoles={[
                "SATS",
                "Records",
                "ASE",
                "JSE",
                "Registrar",
                "Director",
                "super-admin"
              ]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/files/:staffId`}
              component={ViewStaffDocuments}
              pathAfterFailure="/logout"
              {...rest}
            />

            <Authorized
              allowedRoles={["SATS", "Records", "ASE", "JSE", "super-admin"]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/add_cadre`}
              component={AddCadrePage}
              pathAfterFailure="/logout"
              {...rest}
            />

            <Authorized
              allowedRoles={[
                "SATS",
                "Records",
                "ASE",
                "JSE",
                "super-admin",
                "Registrar"
              ]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/propose_posting`}
              component={StaffProposePostingPage}
              pathAfterFailure="/logout"
              {...rest}
            />

            <Authorized
              allowedRoles={[
                "SATS",
                "Records",
                "ASE",
                "JSE",
                "Registrar",
                "Director",
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
