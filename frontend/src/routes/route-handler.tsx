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
import ConditionalRenderer from "../components/conditional-renderer";
import MilestoneTemplatesLayout from "../components/milestone-templates-layout";
import CourseMilestoneTemplatesCreationPage from "../components/pages/course-milestone-templates-creation-page";
import CourseMilestoneTemplatesEditPage from "../components/pages/course-milestone-templates-edit-page";
import CourseMilestoneTemplatesViewPage from "../components/pages/course-milestone-templates-view-page";
import MilestoneTemplatesNestedLayout from "../components/milestone-templates-nested-layout";
import CourseMilestoneSubmissionsPage from "../components/pages/course-milestone-submissions-page";
import MilestoneLayout from "../components/milestone-layout";
import MilestoneDetailsLayout from "../components/milestone-details-layout";
import useGetTemplatePermissions from "../custom-hooks/use-get-template-permissions";
import CourseMilestoneSubmissionsTemplatesViewPage from "../components/pages/course-milestone-submissions-templates-view-page";
import CourseMilestoneSubmissionsViewPage from "../components/pages/course-milestone-submissions-view-page";
import useGetCourseMilestoneSubmissionPermissions from "../custom-hooks/use-get-course-milestone-submission-permissions";

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
                element={
                  <MilestoneLayout>
                    <Outlet />
                  </MilestoneLayout>
                }
                path="milestones/:milestoneId"
              >
                <Route
                  element={
                    <MilestoneDetailsLayout>
                      <Outlet />
                    </MilestoneDetailsLayout>
                  }
                >
                  <Route
                    index
                    element={<Navigate to="submissions" replace />}
                  />
                  <Route
                    path="submissions"
                    element={<CourseMilestoneSubmissionsPage />}
                  />
                </Route>
                <Route
                  path="submissions/templates"
                  element={
                    <ConditionalRenderer
                      permissionGetter={{
                        fn: useGetCourseMilestoneSubmissionPermissions,
                        key: "canCreate",
                      }}
                      fallback={<Navigate to="/dashboard" replace />}
                    >
                      <CourseMilestoneTemplatesPage studentView>
                        <Outlet />
                      </CourseMilestoneTemplatesPage>
                    </ConditionalRenderer>
                  }
                >
                  <Route
                    path=":templateId"
                    element={<CourseMilestoneSubmissionsTemplatesViewPage />}
                  />
                </Route>
                <Route
                  path="submissions/:submissionId"
                  element={<CourseMilestoneSubmissionsViewPage />}
                />
              </Route>
              <Route
                path="templates"
                element={
                  <ConditionalRenderer
                    permissionGetter={{
                      fn: useGetTemplatePermissions,
                      key: "canManage",
                    }}
                    fallback={<Navigate to="/dashboard" replace />}
                  >
                    <MilestoneTemplatesLayout>
                      <Outlet />
                    </MilestoneTemplatesLayout>
                  </ConditionalRenderer>
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
