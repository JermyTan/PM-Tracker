import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { selectIsLoggedIn } from "../redux/slices/current-user-slice";
import AppLayout from "../components/app-layout";
import CoursePageLayout from "../components/course-page-layout";
import LoginPage from "../components/pages/login-page";
import DashboardPage from "../components/pages/dashboard-page";
import MyCoursesPage from "../components/pages/my-courses-page";
import MyAccountPage from "../components/pages/my-account-page";
import CourseMilestonesPage from "../components/pages/course-milestones-page";
import CourseGroupPage from "../components/pages/course-groups-page";
import CourseDetailsPage from "../components/pages/course-details-page";
import CourseMilestoneTemplatesPage from "../components/pages/course-milestone-templates-page";
import RoleRestrictedWrapper from "../components/role-restricted-wrapper";
import { Role } from "../types/courses";
import MilestoneTemplatesLayout from "../components/milestone-templates-layout";
import CourseMilestoneTemplatesCreationPage from "../components/pages/course-milestone-templates-creation-page";
import CourseMilestoneTemplatesEditPage from "../components/pages/course-milestone-templates-edit-page";
import CourseMilestoneTemplatesViewPage from "../components/pages/course-milestone-templates-view-page";
import MilestoneTemplatesNestedLayout from "../components/milestone-templates-nested-layout";

function RouteHandler() {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  return (
    <Routes>
      {isLoggedIn ? (
        <Route
          path="/"
          element={
            <AppLayout>
              <Outlet />
            </AppLayout>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="account" element={<MyAccountPage />} />
          <Route path="courses">
            <Route index element={<Navigate to="me" replace />} />
            <Route path="me" element={<MyCoursesPage />} />
            <Route
              path=":courseId"
              element={
                <CoursePageLayout>
                  <Outlet />
                </CoursePageLayout>
              }
            >
              <Route index element={<Navigate to="milestones" replace />} />
              <Route path="milestones" element={<CourseMilestonesPage />} />
              <Route
                path="templates"
                element={
                  <RoleRestrictedWrapper
                    allowedRoles={[Role.CoOwner, Role.Instructor]}
                    fallback={<Navigate to="/dashboard" replace />}
                  >
                    <MilestoneTemplatesLayout>
                      <Outlet />
                    </MilestoneTemplatesLayout>
                  </RoleRestrictedWrapper>
                }
              >
                <Route
                  path=""
                  element={
                    <CourseMilestoneTemplatesPage>
                      <Outlet />
                    </CourseMilestoneTemplatesPage>
                  }
                >
                  <Route
                    path=":templateId"
                    element={<CourseMilestoneTemplatesViewPage />}
                  />
                </Route>
                <Route
                  element={
                    <MilestoneTemplatesNestedLayout>
                      <Outlet />
                    </MilestoneTemplatesNestedLayout>
                  }
                >
                  <Route
                    path="new"
                    element={<CourseMilestoneTemplatesCreationPage />}
                  />
                  <Route
                    path=":templateId/edit"
                    element={<CourseMilestoneTemplatesEditPage />}
                  />
                </Route>
              </Route>
              <Route path="groups" element={<CourseGroupPage />} />
              <Route path="details" element={<CourseDetailsPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      ) : (
        <Route path="*" element={<LoginPage />} />
      )}
    </Routes>
  );
}

export default RouteHandler;
