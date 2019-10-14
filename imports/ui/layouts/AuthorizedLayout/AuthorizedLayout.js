/*eslint-disable */
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import Authorized from "../../components/Authorized/Authorized";
import AddStaffDocuments from "../../pages/AddStaffDocuments/AddStaffDocuments";
import StaffPostingTab from "../../pages/StaffPostingTab/StaffPostingTab";
import RegistrarViewPosting from "../../pages/RegistrarViewPosting/RegistrarViewPosting";
import ApprovedPostingList from "../../components/ApprovedPostingList/ApprovedPostingList";
import DashBoard from "../../pages/DashBoard/DashBoard";
import NotFound from "../../pages/NotFound/NotFound";
import SearchStaffRecords from "../../pages/SearchStaffRecords/SearchStaffRecords";
import StaffDetailsPage from "../../pages/StaffDetailsPage/StaffDetailsPage";
import StaffProposePostingPage from "../../pages/StaffProposePostingPage/StaffProposePostingPage";
import StaffPromotionNew from "../../pages/StaffPromotionNew/StaffPromotionNew";
import HomePageDashboard from "../../pages/HomePageDashboard/HomePageDashboard";
import StaffNominalRoll from "../../pages/StaffNominalRoll/StaffNominalRoll";
import StaffPostingStats from "../../pages/StaffPostingStats/StaffPostingStats";
import ViewStaffDocuments from "../../components/StaffDocumentViewer/StaffDocumentViewer";
import AdminAccountPage from "../../pages/AdminAccountPage/AdminAccountPage";
import UserStatus from "../../pages/UserStatus/UserStatus";
import Profile from "../../pages/Profile/Profile";
import AdminUploadStaffData from "../../pages/AdminUploadStaffData/AdminUploadStaffData";
import AnnualSalaryIncrement from "../../pages/AnnualSalaryIncrement/AnnualSalaryIncrement";
import PromotionList from "../../pages/PromotionList/PromotionList";
import StaffReliefPosting from "../../pages/StaffReliefPosting/StaffReliefPosting";
import WithdrawPromotion from "../../components/WithdrawPromotionForm/WithdrawPromotionForm";
import ApproveWithdrawPromotion from "../../pages/ApproveWithdrawPromotion/ApproveWithdrawPromotion";
import ActivityLog from "../../pages/ActivityLogs/ActivityLogs";
import SearchDocument from "../../pages/SearchDocuments/SearchDocuments";
import AddSalaryStep from "../../pages/AddSalaryStep/AddSalaryStep";
import EditSalaryStructure from "../../pages/EditSalaryStructure/EditSalaryStructure";
import StaffSalaryStructure from "../../pages/StaffBySalaryStructure/StaffBySalaryStructure";
import AddNewCadre from "../../pages/AddNewCadre/AddNewCadre";
import NewPensionDashboard from "../../pages/NewPensionDashboard/NewPensionDashboard";
import AddNewStaff from "../../pages/AddNewStaffData/AddNewStaffData";
import AddPersonnelDocuments from "../../pages/AddPersonnelDocuments/AddPersonnelDocuments";
import ViewPersonnelDocuments from "../../pages/ViewPersonnelDocuments/ViewPersonnelDocuments";
import NotificationPage from "../../components/Notification/Notification";

const AuthorizedLayout = ({ match, userId, ...rest }) => (
  <div className="loginLayout">
    <Row>
      <Col md={12}>
        <div>
          <Switch>
            {/* super admin links starts  */}
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
              path={`${match.path}/step_increment`}
              component={AnnualSalaryIncrement}
              pathAfterFailure="/logout"
              {...rest}
            />

            <Authorized
              allowedRoles={["super-admin"]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/upload_data`}
              component={AdminUploadStaffData}
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
              allowedRoles={["super-admin"]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/logs`}
              component={ActivityLog}
              pathAfterFailure="/logout"
              {...rest}
            />

            {/* super admin links end  */}

            {/* sats|| ase|| director|| registrar|| records|| links start  */}

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
              path={`${match.path}/promotion_list`}
              component={PromotionList}
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
              path={`${match.path}/notifications`}
              component={NotificationPage}
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
                "Records",
                "ASE",
                "Director",
                "JSE",
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
                "Registrar"
              ]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/due_for_promotion`}
              component={StaffPromotionNew}
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
                "JSE"
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
                "JSE"
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
                "JSE"
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
              allowedRoles={["Records", "Director", "Registrar"]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/search_documents`}
              component={SearchDocument}
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
                "Director"
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

            {/* sats|| ase|| director|| registrar|| records|| links end  */}

            {/* sats|| director|| registrar|| jse|| links start  */}
            <Authorized
              allowedRoles={["SATS", "Director", "JSE", "Registrar"]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/relief_posting`}
              component={StaffReliefPosting}
              pathAfterFailure="/logout"
              {...rest}
            />

            <Authorized
              allowedRoles={["SATS", "Director", "JSE", "Registrar"]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/staff_posting`}
              component={StaffPostingTab}
              pathAfterFailure="/logout"
              {...rest}
            />

            <Authorized
              allowedRoles={["SATS", "Director", "JSE", "Registrar"]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/posting_stats`}
              component={StaffPostingStats}
              pathAfterFailure="/logout"
              {...rest}
            />

            <Authorized
              allowedRoles={["SATS", "Records", "Registrar", "Director", "JSE"]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/posting_list`}
              component={ApprovedPostingList}
              pathAfterFailure="/logout"
              {...rest}
            />

            <Authorized
              allowedRoles={["SATS", "Records", "JSE", "ASE"]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/add_staff_documents`}
              pathAfterFailure="/logout"
              component={AddStaffDocuments}
              {...rest}
            />

            <Authorized
              allowedRoles={["SATS", "Records", "JSE", "ASE", "Director"]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/view_dhr_documents`}
              pathAfterFailure="/logout"
              component={ViewPersonnelDocuments}
              {...rest}
            />

            <Authorized
              allowedRoles={["SATS", "Records", "JSE", "ASE"]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/add_personnel_documents`}
              pathAfterFailure="/logout"
              component={AddPersonnelDocuments}
              {...rest}
            />

            <Authorized
              allowedRoles={["SATS", "Director", "JSE", "Registrar"]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/propose_posting`}
              component={StaffProposePostingPage}
              pathAfterFailure="/logout"
              {...rest}
            />

            {/* sats||director|| registrar|| jse|| links end  */}

            {/* sats|| || jse|| links end  */}

            <Authorized
              allowedRoles={["SATS", "ASE", "JSE", "Director"]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/withdraw_promotion`}
              component={WithdrawPromotion}
              pathAfterFailure="/logout"
              {...rest}
            />

            {/* sats|| || jse|| links  */}

            {/* records links start  */}

            <Authorized
              allowedRoles={["Records"]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/add_staff_data`}
              pathAfterFailure="/logout"
              component={AddNewStaff}
              {...rest}
            />

            {/* records links  end */}

            <Authorized
              allowedRoles={["Records", "Pensions", "Director", "Registrar"]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/dashboard/pensions/home`}
              component={NewPensionDashboard}
              pathAfterFailure="/logout"
              {...rest}
            />

            <Authorized
              allowedRoles={["Registrar"]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/registrar/staff_posting`}
              component={RegistrarViewPosting}
              pathAfterFailure="/logout"
              {...rest}
            />

            <Authorized
              allowedRoles={["Registrar"]}
              group="Personnel"
              userId={userId}
              exact
              path={`${match.path}/promotion_request_approval`}
              component={ApproveWithdrawPromotion}
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
              path={`${match.path}/add_salary_step`}
              component={AddSalaryStep}
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
              path={`${match.path}/edit_salary_step`}
              component={EditSalaryStructure}
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
              path={`${match.path}/view_staff_by_salary_scale`}
              component={StaffSalaryStructure}
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
              path={`${match.path}/add_cadre`}
              component={AddNewCadre}
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
