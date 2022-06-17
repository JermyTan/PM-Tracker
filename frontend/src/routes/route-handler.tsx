import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { selectIsLoggedIn } from "../redux/slices/current-user-slice";
import {
  ACCOUNT_PATH,
  CATCH_ALL,
  COURSES_PATH,
  COURSE_DETAILS_PATH,
  COURSE_GROUPS_PATH,
  COURSE_MILESTONES_PATH,
  DASHBOARD_PATH,
  MY_COURSES_PATH,
  ROOT_PATH,
  SINGLE_COURSE_PATH,
} from "./paths";
import AppLayout from "../components/app-layout";
import CoursePageLayout from "../components/course-page-layout";
import LoginPage from "../components/pages/login-page";
import DashboardPage from "../components/pages/dashboard-page";
import MyCoursesPage from "../components/pages/my-courses-page";
import MyAccountPage from "../components/pages/my-account-page";
import CourseMilestonePage from "../components/pages/course-milestone-page";
import CourseGroupPage from "../components/pages/course-groups-page";
import CourseDetailsPage from "../components/pages/course-details-page";

function RouteHandler() {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  return (
    <Routes>
      {isLoggedIn ? (
        <Route
          path={ROOT_PATH}
          element={
            <AppLayout>
              <Outlet />
            </AppLayout>
          }
        >
          <Route index element={<Navigate to={DASHBOARD_PATH} />} />
          <Route path={DASHBOARD_PATH} element={<DashboardPage />} />
          <Route path={ACCOUNT_PATH} element={<MyAccountPage />} />
          <Route path={COURSES_PATH}>
            <Route index element={<Navigate to={MY_COURSES_PATH} />} />
            <Route path={MY_COURSES_PATH} element={<MyCoursesPage />} />
            <Route
              path={SINGLE_COURSE_PATH}
              element={
                <CoursePageLayout>
                  <Outlet />
                </CoursePageLayout>
              }
            >
              <Route index element={<Navigate to="milestones" />} />
              <Route
                path={COURSE_MILESTONES_PATH}
                element={<CourseMilestonePage />}
              />
              <Route path={COURSE_GROUPS_PATH} element={<CourseGroupPage />} />
              <Route
                path={COURSE_DETAILS_PATH}
                element={<CourseDetailsPage />}
              />
            </Route>
          </Route>
          <Route path={CATCH_ALL} element={<Navigate to={DASHBOARD_PATH} />} />
        </Route>
      ) : (
        <Route path={CATCH_ALL} element={<LoginPage />} />
      )}
    </Routes>
  );
}

export default RouteHandler;
